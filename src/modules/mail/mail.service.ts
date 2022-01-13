import { Injectable } from "@nestjs/common";


@Injectable()
export class MailService {

  async getInformation() {
    return {
      mailServer: process.env.MAIL_SERVER,
      mailPort: process.env.MAIL_PORT,
      mail_ADD: process.env.MAIL_ADD,
    }
  }
}
