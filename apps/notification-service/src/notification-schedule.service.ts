import { Inject, Injectable, Logger } from '@nestjs/common';
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
import { InternalServerErrorRpcExcption } from '~/shared/exceptions/internal-server-error-rpc-exception';
import { toBoolean } from '~/shared/utils/toboolean.util';
import { BadRequestRpcExcption } from '~/shared/exceptions/bad-request-rpc-exception';

@Injectable()
export class NotificationScheduleService {
  private scheduleList: Map<string, CronJob>;
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
    await Promise.all([
      config.forEach((item) => {
        let job: CronJob | undefined;
        try {
          job = this.schedulerRegistry.getCronJob(item.name);
        } catch {
          job = undefined;
        }
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
          if (item.active) newJob.start();
          else newJob.stop();
        } else {
          job.setTime(new CronTime(item.cron));
          if (item.active) job.start();
          else job.stop();
        }
      }),
    ]);
    try {
      this.scheduleList = this.schedulerRegistry.getCronJobs();
    } catch {
      /* empty */
    }
  }

  private async runCallback(item: ScheduleDto) {
    switch (item.type) {
      case ScheduleType.url: {
        const { url, method, body } = item.action;
        const { data: httpData } = await this.http.axiosRef[method || 'get'](
          url,
          {
            ...(body || {}),
          },
        );
        return httpData;
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
        const { data: httpData } = await this.http.axiosRef[method || 'get'](
          url,
          {
            ...(body || {}),
            ...data,
          },
        );
        return httpData;
      }
      case AfterSchedule.store:
        return await transportReqToMicroservice(
          this.client,
          StoreEvents.StoreFileCreateByMaster,
          {
            name: `${item.name}_${new Date().toISOString()}.json`,
            content: data,
          },
        );
      default:
        break;
    }
  }

  private async recordError(name: string, e: Error) {
    Logger.warn(
      `Schedule ${name} error: ${e.message}`,
      NotificationScheduleService.name,
    );
    const raw = await this.config.get('schedule');
    const config = raw.find((item) => item.name === name);
    config?.error?.push({
      message: e.message,
      time: new Date(),
    });
    return await this.config
      .patchAndValidate('schedule', [
        ...raw.filter((item) => item.name !== name),
        config,
      ])
      .catch((e) => {
        throw new InternalServerErrorRpcExcption(e.message);
      });
  }

  async getScheduleList() {
    const jobs = this.scheduleList;
    const config = await this.config.get('schedule');
    const arrayJobs = Array.from(jobs).map((job) => {
      const configItem = config.find((item) => item.name === job[0]);
      if (!configItem) {
        return null;
      }
      return {
        name: configItem.name,
        cron: configItem.cron,
        next: job[1].nextDate().toJSDate(),
        last: job[1].lastDate(),
        type: configItem.type,
        after: configItem.after,
        error: configItem.error,
        running: job[1].running,
      };
    });
    return arrayJobs;
  }

  async getScheduleDetail(name: string) {
    let job: CronJob;
    try {
      job = this.schedulerRegistry.getCronJob(name);
    } catch {
      throw new NotFoundRpcExcption("Schedule doesn't exist");
    }
    const config = await this.config.get('schedule');
    const configItem = config.find((item) => item.name === name);
    return {
      ...configItem,
      next: job.nextDate().toJSDate(),
      last: job.lastDate(),
      running: job.running,
    };
  }

  async createSchedule(data: ScheduleDto) {
    if (!data.active) {
      data.active = true;
    } else {
      data.active = toBoolean(data.active);
    }
    const config = await this.config.get('schedule');
    if (config.find((item) => item.name === data.name)) {
      throw new BadRequestRpcExcption('Schedule name already exists');
    }
    const newConfig = [
      ...config.filter((item) => item.name !== data.name),
      {
        ...data,
        active: data.active ? toBoolean(data.active) : true,
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
    let job: CronJob;
    try {
      job = this.schedulerRegistry.getCronJob(name);
      job.stop();
      job.setTime(new CronTime(data.cron));
      job.start();
    } catch {
      throw new NotFoundRpcExcption("Schedule doesn't exist");
    }
    return await this.getScheduleDetail(name);
  }

  async deleteSchedule(name: string) {
    const config = await this.config.get('schedule');
    const newConfig = config.filter((item) => item.name !== name);
    await this.config.patchAndValidate('schedule', newConfig);
    this.schedulerRegistry.deleteCronJob(name);
    return await this.getScheduleList();
  }

  async runSchedule(name: string) {
    const config = await this.config.get('schedule');
    const configItem = config.find((item) => item.name === name);
    if (!configItem) {
      throw new NotFoundRpcExcption("Schedule doesn't exist");
    }
    nextTick(async () => {
      const data = await this.runCallback(configItem);
      await this.runAfter(configItem, data).catch((e) => {
        this.recordError(name, e);
      });
    });
    return await this.getScheduleDetail(name);
  }

  async toggleSchedule(name: string) {
    let job: CronJob;
    try {
      job = this.schedulerRegistry.getCronJob(name);
    } catch {
      throw new NotFoundRpcExcption("Schedule doesn't exist");
    }
    const config = await this.config.get('schedule');
    const configItem = config.find((item) => item.name === name);
    if (!configItem) {
      throw new NotFoundRpcExcption("Schedule doesn't exist");
    }
    configItem.active = !configItem.active;
    await this.config.patchAndValidate('schedule', [
      ...config.filter((item) => item.name !== name),
      configItem,
    ]);
    if (job.running) {
      job.start();
    } else {
      job.stop();
    }
    return await this.getScheduleDetail(name);
  }
}
