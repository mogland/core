import { Module } from "@nestjs/common";
import { MailController } from "./mail.controller";
import { EmailService } from "./mail.service";

@Module({
  // imports
  controllers: [MailController],
  providers: [EmailService],
})
export class MailModule {}
