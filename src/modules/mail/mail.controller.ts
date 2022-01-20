import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { MailService } from "./mail.service";
import { Get } from "@nestjs/common";

@Controller("mail")
@ApiTags("Mail (TODO)")
export class MailController {
  constructor(private mailService: MailService){}

  @Get("information")
  async getInformation(){
    return await this.mailService.getInformation()
  }
}
