import { Injectable } from "@nestjs/common";
// import { createTransport } from 'nodemailer'

@Injectable()
export class MailService {

  private getInformation() {
    return {
      host: process.env.MAIL_SERVER,
      port: process.env.MAIL_PORT,
      secure: true,
      auth: {
        user: process.env.MAIL_USER, // generated ethereal user
        pass: process.env.MAIL_PASSWORD, // generated ethereal password
      },
    }
  }

  async sendMail(mail: any) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const nodemailer = require('nodemailer')
    const transporter = nodemailer.createTransport({
      ...this.getInformation(),
      secure: true, // true for 465, false for other ports
      tls: {
        rejectUnauthorized: false
      }
    });

    let subject: string
    switch (mail.subject) {
    case "comments":
      subject = "GoldenSpace 收到了一条评论"
      break;
    case "reply":
      subject = "Hello 你的评论收到一条回复～"
      break;
    default:
      break;
    }

    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"GoldenSpace MailService" < ' + this.getInformation().auth.user + ' >', // sender address
      to: mail.to, // list of receivers    
      subject: subject, // Subject line
      text: subject, // plain text body
      html: mail.html, // html body
    });

    return info
    // console.log("Message sent: %s", info.messageId);
  }

}