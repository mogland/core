import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob, CronTime } from 'cron';
import { ConfigService } from '~/libs/config/src';
import { ScheduleDto } from '~/libs/config/src/config.dto';
import { HttpService } from '~/libs/helper/src/helper.http.service';
import { AfterSchedule, ScheduleType } from './schedule.enum';
import { nextTick } from 'process';
import { transportReqToMicroservice } from '~/shared/microservice.transporter';
import { StoreEvents } from '~/shared/constants/event.constant';
import { NotFoundRpcExcption } from '~/shared/exceptions/not-found-rpc-exception';

@Injectable()
export class NotificationScheduleService {
  constructor(
    private readonly config: ConfigService,
    private readonly http: HttpService,
    @Inject('NOTIFICATION_SCHEDULE_SERVICE')
    private readonly client: ClientProxy,
    private schedulerRegistry: SchedulerRegistry,
  ) {
    this.init();
  }

  private async init() {
    const config = await this.config.get('schedule');
    Promise.all([
      config.forEach((item) => {
        const job = this.schedulerRegistry.getCronJob(item.name);
        if (!job) {
          const newJob = new CronJob(item.cron, async () => {
            try {
              const data = await this.runCallback(item);
              nextTick(async () => {
                await this.runAfter(item, data).catch((e) => {
                  this.recordError(item.name, e);
                });
              });
              return data;
            } catch (e) {
              this.recordError(item.name, e);
            }
          });
          this.schedulerRegistry.addCronJob(item.name, newJob);
          newJob.start();
        } else {
          job.setTime(new CronTime(item.cron));
          job.start();
        }
      }),
    ]);
  }

  private async runCallback(item: ScheduleDto) {
    switch (item.type) {
      case ScheduleType.url: {
        const { url, method, body } = item.action;
        const { data } = await this.http.axiosRef[method](url, body);
        return data;
      }
      case ScheduleType.event: {
        const { event, data: eventData, time, emit } = item.action;
        return await transportReqToMicroservice(
          this.client,
          event,
          eventData,
          time.length ? time : 3000,
          emit,
        );
      }
      default:
        break;
    }
  }

  private async runAfter(item: ScheduleDto, data: any) {
    switch (item.after) {
      case AfterSchedule.url: {
        const { url, method, body } = item.afterAction;
        const { data: httpData } = await this.http.axiosRef[method](url, {
          ...body,
          ...data,
        });
        return httpData;
      }
      case AfterSchedule.store:
        return await transportReqToMicroservice(
          this.client,
          StoreEvents.StoreFileCreateByMaster,
          {
            name: item.name,
            content: data,
          },
        );
      default:
        break;
    }
  }

  private async recordError(name: string, e: Error) {
    const raw = await this.config.get('schedule');
    const config = raw.find((item) => item.name === name);
    config?.error?.push({
      message: e.message,
      time: new Date(),
    });
    return await this.config.patchAndValidate('schedule', [
      ...raw.filter((item) => item.name !== name),
      config,
    ]);
  }

  async getScheduleList() {
    const jobs = this.schedulerRegistry.getCronJobs();
    const config = await this.config.get('schedule');
    const arrayJobs = Object.values(jobs).map((job) => {
      const configItem = config.find((item) => item.name === job.name);
      return {
        name: job.name,
        cron: job.cronTime.source,
        next: job.nextDate().toDate(),
        last: job.lastDate().toDate(),
        type: configItem?.type,
        after: configItem?.after,
        error: configItem?.error,
      };
    });
    return arrayJobs;
  }

  async getScheduleDetail(name: string) {
    const job = this.schedulerRegistry.getCronJob(name);
    const config = await this.config.get('schedule');
    const configItem = config.find((item) => item.name === name);
    return {
      name: configItem?.name,
      cron: configItem?.cron,
      next: job.nextDate().toJSDate(),
      last: job.lastDate(),
      type: configItem?.type,
      after: configItem?.after,
      error: configItem?.error,
      running: job.running,
    };
  }

  async createSchedule(data: ScheduleDto) {
    const config = await this.config.get('schedule');
    const newConfig = [
      ...config,
      {
        ...data,
        error: [],
      },
    ];
    await this.config.patchAndValidate('schedule', newConfig);
    await this.init();
    return await this.getScheduleDetail(data.name);
  }

  async updateSchedule(name: string, data: ScheduleDto) {
    const config = await this.config.get('schedule');
    const newConfig = [
      ...config.filter((item) => item.name !== name),
      {
        ...data,
        error: [],
      },
    ];
    await this.config.patchAndValidate('schedule', newConfig);
    const job = this.schedulerRegistry.getCronJob(name);
    job.stop();
    job.setTime(new CronTime(data.cron));
    job.start();
    return await this.getScheduleDetail(name);
  }

  async deleteSchedule(name: string) {
    const config = await this.config.get('schedule');
    const newConfig = config.filter((item) => item.name !== name);
    await this.config.patchAndValidate('schedule', newConfig);
    const job = this.schedulerRegistry.getCronJob(name);
    job.stop();
    return await this.getScheduleList();
  }

  async runSchedule(name: string) {
    const config = await this.config.get('schedule');
    const configItem = config.find((item) => item.name === name);
    if (!configItem) {
      throw new NotFoundRpcExcption("Schedule doesn't exist");
    }
    const data = await this.runCallback(configItem);
    nextTick(async () => {
      await this.runAfter(configItem, data).catch((e) => {
        this.recordError(name, e);
      });
    });
    return await this.getScheduleDetail(name);
  }
}
