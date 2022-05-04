import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { EmailService, ReplyMailType } from "./mail.service";

@Controller("mail")
@ApiTags("Mail (TODO)")
export class MailController {
  constructor(private mailService: EmailService){}

  @Post("send")
  async sendMail(@Body() body) {
    await this.mailService.sendCommentNotificationMail({
      to: '1596355173@qq.com',
      type: ReplyMailType.Guest,
      // source: {
      //   title: refDoc.title,
      //   text: model.text,
      //   author: type === ReplyMailType.Guest ? parent!.author : model.author,
      //   master: master.name,
      //   link: await this.resolveUrlByType(refType, refDoc),
      //   time: parsedTime,
      //   mail: ReplyMailType.Owner === type ? model.mail : master.mail,
      //   ip: model.ip || '',
      // },
    })
  }
}
