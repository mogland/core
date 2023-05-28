import { Controller } from '@nestjs/common';
import { NotificationScheduleService } from './notification-schedule.service';
import { MessagePattern } from '@nestjs/microservices';
import { NotificationEvents } from '~/shared/constants/event.constant';
import { ScheduleDto } from '~/libs/config/src/config.dto';

@Controller()
export class NotificationScheduleServiceController {
  constructor(private readonly scheduleService: NotificationScheduleService) {}

  @MessagePattern({ cmd: NotificationEvents.ScheduleCreateByMaster })
  async createSchedule(input: ScheduleDto) {
    return this.scheduleService.createSchedule(input);
  }

  @MessagePattern({ cmd: NotificationEvents.ScheduleDeleteByMaster })
  async deleteSchedule(id: string) {
    return this.scheduleService.deleteSchedule(id);
  }

  @MessagePattern({ cmd: NotificationEvents.ScheduleUpdateByMaster })
  async updateSchedule(input: { id: string; body: ScheduleDto }) {
    return this.scheduleService.updateSchedule(input.id, input.body);
  }

  @MessagePattern({ cmd: NotificationEvents.ScheduleGetByMaster })
  async getSchedule(id: string) {
    return this.scheduleService.getScheduleDetail(id);
  }

  @MessagePattern({ cmd: NotificationEvents.SchedulesGetAllByMaster })
  async getSchedules() {
    return this.scheduleService.getScheduleList();
  }

  @MessagePattern({ cmd: NotificationEvents.ScheduleRunByMaster })
  async runSchedule(id: string) {
    return this.scheduleService.runSchedule(id);
  }

  @MessagePattern({ cmd: NotificationEvents.ScheduleToggleByMaster })
  async toggleSchedule(id: string) {
    return this.scheduleService.toggleSchedule(id);
  }
}
