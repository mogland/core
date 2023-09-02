import { Controller } from '@nestjs/common';
import { NotificationScheduleService } from './notification-schedule.service';
import { MessagePattern } from '@nestjs/microservices';
import { NotificationEvents } from '~/shared/constants/event.constant';
import { ScheduleDto } from '~/apps/config-service/src/config.dto';

@Controller()
export class NotificationScheduleServiceController {
  constructor(private readonly scheduleService: NotificationScheduleService) {}

  @MessagePattern({ cmd: NotificationEvents.ScheduleCreateByMaster })
  async createSchedule(input: ScheduleDto) {
    return this.scheduleService.createSchedule(input);
  }

  @MessagePattern({ cmd: NotificationEvents.ScheduleDeleteByMaster })
  async deleteSchedule(token: string) {
    return this.scheduleService.deleteSchedule(token);
  }

  @MessagePattern({ cmd: NotificationEvents.ScheduleUpdateByMaster })
  async updateSchedule(input: { token: string; body: ScheduleDto }) {
    return this.scheduleService.updateSchedule(input.token, input.body);
  }

  @MessagePattern({ cmd: NotificationEvents.ScheduleGetByMaster })
  async getSchedule(token: string) {
    return this.scheduleService.getScheduleDetail(token);
  }

  @MessagePattern({ cmd: NotificationEvents.SchedulesGetAllByMaster })
  async getSchedules() {
    return this.scheduleService.getScheduleList();
  }

  @MessagePattern({ cmd: NotificationEvents.ScheduleRunByMaster })
  async runSchedule(token: string) {
    return this.scheduleService.runSchedule(token);
  }

  @MessagePattern({ cmd: NotificationEvents.ScheduleToggleByMaster })
  async toggleSchedule(token: string) {
    return this.scheduleService.toggleSchedule(token);
  }
}
