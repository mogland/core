import { Module } from "@nestjs/common";
import { ConfigsModule } from "configs/configs.module";
import { ConfigsService } from "configs/configs.service";
import { MailController } from "./mail.controller";
import { EmailService } from "./mail.service";

@Module({
  imports: [ConfigsModule],
  controllers: [MailController],
  providers: [EmailService, ConfigsService],
})
export class MailModule {}
