import { Controller, Inject } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ApiName } from "~/shared/common/decorator/openapi.decorator";
import { ServicesEnum } from "~/shared/constants/services.constant";

@Controller("schedule")
@ApiName
export class ScheduleController {
  constructor(
    @Inject(ServicesEnum.notification) private readonly notification: ClientProxy
  ){}
}