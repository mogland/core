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

@Injectable()
export class NotificationScheduleService {
  constructor(
    private readonly config: ConfigService,
    private readonly http: HttpService,
    private readonly assets: AssetsService,
    @Inject('NOTIFICATION_SCHEDULE_SERVICE')
    private readonly client: ClientProxy,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  private async init() {
    const config = await this.config.get('schedule');
    Promise.all([
      config.forEach((item) => {
        const job = this.schedulerRegistry.getCronJob(item.name);
        if (!job) {
          const newJob = new CronJob(item.cron, async () => {
            return await this.runCallback(item);
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
      case Number(ScheduleType.url):
        const { url, method, body } = item.action;
        const { data } = await this.http.axiosRef[method](url, body);
        return data;
      case ScheduleType.event:
        break;
      default:
        break;
    }
  }

  private async runAfter(item: ScheduleDto, data: any) {
    switch (item.after) {
      case Number(AfterSchedule.url):
        const { url, method, body } = item.afterAction;
        const { data } = await this.http.axiosRef[method](url, body);
        return data;
      case AfterSchedule.store:
        // 如果是文件，直接保存，如果是文字，变成文件保存
        if (typeof data === 'string') {
          
        }
      default:
        break;
    }
  }
}
