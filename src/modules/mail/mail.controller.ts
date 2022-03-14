import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { MailService } from "./mail.service";
import { Get } from "@nestjs/common";

@Controller("mail")
@ApiTags("Mail (TODO)")
export class MailController {
  constructor(private mailService: MailService){}

  @Get()
  async sendMail() {
    await this.mailService.sendMail({
      to: "1596355173@qq.com",
      subject: "comments",
      text: "评论收到了一条回复",
      html: "<h1>test</h1>"
    });
  }
}
