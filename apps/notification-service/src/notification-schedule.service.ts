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
import { v4 } from 'uuid';

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
          job = this.schedulerRegistry.getCronJob(item.id);
        } catch {
          job = undefined;
        }
        if (!job) {
          const newJob = new CronJob(item.cron, async () => {
            try {
              const data = await this.runCallback(item);
              nextTick(async () => {
                await this.runAfter(item, data).catch((e) => {
                  this.recordError(item.name, item.id, e);
                });
              });
              return data;
            } catch (e) {
              this.recordError(item.name, item.id, e);
            }
          });
          this.schedulerRegistry.addCronJob(item.id, newJob);
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
      const scheduleNames = config.map((item) => item.id);
      const scheduleListNames = Array.from(this.scheduleList.keys());
      scheduleListNames.forEach((name) => {
        if (!scheduleNames.includes(name)) {
          this.schedulerRegistry.deleteCronJob(name);
        }
      });
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
      case AfterSchedule.none:
      default:
        break;
    }
  }

  private async recordError(name: string, id: string, e: Error) {
    Logger.warn(
      `Schedule ${name} error: ${e.message}`,
      NotificationScheduleService.name,
    );
    const raw = await this.config.get('schedule');
    const config = raw.find((item) => item.id === id);
    config?.error?.push({
      message: e.message,
      time: new Date(),
    });
    return await this.config
      .patchAndValidate('schedule', [
        ...raw.filter((item) => item.id !== id),
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
      const configItem = config.find((item) => item.id === job[0]);
      if (!configItem) {
        return null;
      }
      return {
        name: configItem.name,
        cron: configItem.cron,
        description: configItem.description,
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

  async getScheduleDetail(id: string) {
    let job: CronJob;
    try {
      job = this.schedulerRegistry.getCronJob(id);
    } catch {
      throw new NotFoundRpcExcption("Schedule doesn't exist");
    }
    const config = await this.config.get('schedule');
    const configItem = config.find((item) => item.id === id);
    return {
      ...configItem,
      next: job.nextDate().toJSDate(),
      last: job.lastDate(),
      running: job.running,
    };
  }

  async createSchedule(data: ScheduleDto) {
    data.id = v4();
    if (!data.active) {
      data.active = true;
    } else {
      data.active = toBoolean(data.active);
    }
    const config = await this.config.get('schedule');
    if (config.find((item) => item.id === data.id)) {
      throw new BadRequestRpcExcption('Schedule name already exists');
    }
    const newConfig = [
      ...config.filter((item) => item.id !== data.id),
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

  async updateSchedule(id: string, data: ScheduleDto) {
    const config = await this.config.get('schedule');
    const newConfig = [
      ...config.filter((item) => item.id !== id),
      {
        ...data,
        error: [],
      },
    ];
    await this.config.patchAndValidate('schedule', newConfig);
    await this.init();
    return await this.getScheduleDetail(data.id);
  }

  async deleteSchedule(id: string) {
    const config = await this.config.get('schedule');
    const newConfig = config.filter((item) => item.id !== id);
    await this.config.patchAndValidate('schedule', newConfig);
    this.schedulerRegistry.deleteCronJob(id);
    return await this.getScheduleList();
  }

  async runSchedule(id: string) {
    const config = await this.config.get('schedule');
    const configItem = config.find((item) => item.id === id);
    if (!configItem) {
      throw new NotFoundRpcExcption("Schedule doesn't exist");
    }
    nextTick(async () => {
      const data = await this.runCallback(configItem);
      await this.runAfter(configItem, data).catch((e) => {
        this.recordError(configItem.name, id, e);
      });
    });
    return await this.getScheduleDetail(id);
  }

  async toggleSchedule(id: string) {
    let job: CronJob;
    try {
      job = this.schedulerRegistry.getCronJob(id);
    } catch {
      throw new NotFoundRpcExcption("Schedule doesn't exist");
    }
    const config = await this.config.get('schedule');
    const configItem = config.find((item) => item.id === id);
    if (!configItem) {
      throw new NotFoundRpcExcption("Schedule doesn't exist");
    }
    configItem.active = !configItem.active;
    await this.config.patchAndValidate('schedule', [
      ...config.filter((item) => item.id !== id),
      configItem,
    ]);
    if (job.running) {
      job.stop();
    } else {
      job.start();
    }
    return await this.getScheduleDetail(id);
  }
}
