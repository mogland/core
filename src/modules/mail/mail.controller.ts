import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { EmailService } from "./mail.service";

@Controller("mail")
@ApiTags("Mail (TODO)")
export class MailController {
  constructor(private mailService: EmailService){}

  @Post("send")
  async sendMail(@Body() body) {
    // await this.mailService.sendMail({
    //   to: body.to,
    //   subject: body.subject, // (reply / comments)
    //   text: body.text,
    //   // html: body.html
    // });
  }
}
