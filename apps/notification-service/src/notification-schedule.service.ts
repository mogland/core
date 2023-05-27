import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob, CronTime } from 'cron';
import { ConfigService } from '~/libs/config/src';
import { ScheduleDto } from '~/libs/config/src/config.dto';
import { HttpService } from '~/libs/helper/src/helper.http.service';
import { AfterSchedule, ScheduleType } from './schedule.enum';
import { nextTick } from 'process';
import { AssetsService } from '~/libs/helper/src/helper.assets.service';
import { transportReqToMicroservice } from '~/shared/microservice.transporter';
import { StoreEvents } from '~/shared/constants/event.constant';

@Injectable()
export class NotificationScheduleService {
  constructor(
    private readonly config: ConfigService,
    private readonly http: HttpService,
    private readonly assets: AssetsService,
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
      case ScheduleType.url:
        const { url, method, body } = item.action;
        const { data } = await this.http.axiosRef[method](url, body);
        return data;
      case ScheduleType.event:
        const { event, data: eventData, time, emit } = item.action;
        return await transportReqToMicroservice(
          this.client,
          event,
          eventData,
          time.length ? time : 3000,
          emit,
        );
      default:
        break;
    }
  }

  private async runAfter(item: ScheduleDto, data: any) {
    switch (item.after) {
      case AfterSchedule.url:
        const { url, method, body } = item.afterAction;
        const { data: httpData } = await this.http.axiosRef[method](url, {
          ...body,
          ...data,
        });
        return httpData;
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
    let raw = await this.config.get('schedule');
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
}
