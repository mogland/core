import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Put } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ApiOperation } from "@nestjs/swagger";
import { ScheduleDto } from "~/libs/config/src/config.dto";
import { ApiName } from "~/shared/common/decorator/openapi.decorator";
import { NotificationEvents } from "~/shared/constants/event.constant";
import { ServicesEnum } from "~/shared/constants/services.constant";
import { transportReqToMicroservice } from "~/shared/microservice.transporter";

@Controller("schedule")
@ApiName
export class ScheduleController {
  constructor(
    @Inject(ServicesEnum.notification) private readonly notification: ClientProxy
  ){}

  @Post("")
  @ApiOperation({ summary: "创建定时任务" })
  // @Auth()
  async createSchedule(@Body() body: ScheduleDto) {
    return transportReqToMicroservice(this.notification, NotificationEvents.ScheduleCreateByMaster, body)
  }

  @Delete("/:token")
  @ApiOperation({ summary: "删除定时任务" })
  // @Auth()
  async deleteSchedule(@Param("token") token: string) {
    return transportReqToMicroservice(this.notification, NotificationEvents.ScheduleDeleteByMaster, token)
  }

  @Put("/:token")
  @ApiOperation({ summary: "更新定时任务" })
  // @Auth()
  async updateSchedule(@Param("token") token: string, @Body() body: ScheduleDto) {
    return transportReqToMicroservice(this.notification, NotificationEvents.ScheduleUpdateByMaster, { token, body })
  }

  @Get("/:token/run")
  @ApiOperation({ summary: "立即运行定时任务" })
  // @Auth()
  async runSchedule(@Param("token") token: string) {
    return transportReqToMicroservice(this.notification, NotificationEvents.ScheduleRunByMaster, token)
  }

  @Get("/:token")
  @ApiOperation({ summary: "获取定时任务详情" })
  // @Auth()
  async getSchedule(@Param("token") token: string) {
    return transportReqToMicroservice(this.notification, NotificationEvents.ScheduleGetByMaster, token)
  }

  @Get("")
  @ApiOperation({ summary: "获取所有定时任务" })
  // @Auth()
  async getSchedules() {
    return transportReqToMicroservice(this.notification, NotificationEvents.SchedulesGetAllByMaster, {})
  }

  @Patch("/:token")
  @ApiOperation({ summary: "切换定时任务状态" })
  // @Auth()
  async toggleSchedule(@Param("token") token: string) {
    return transportReqToMicroservice(this.notification, NotificationEvents.ScheduleToggleByMaster, token)
  }

}