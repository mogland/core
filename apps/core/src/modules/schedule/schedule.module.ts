import { Module } from "@nestjs/common";
import { ClientsModule } from "@nestjs/microservices";
import { ServicesEnum } from "~/shared/constants/services.constant";
import { REDIS_TRANSPORTER } from "~/shared/constants/transporter.constants";
import { ScheduleController } from "./schedule.controller";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: ServicesEnum.notification,
        ...REDIS_TRANSPORTER,
      }
    ])
  ],
  controllers: [ScheduleController]
})
export class ScheduleModule{}