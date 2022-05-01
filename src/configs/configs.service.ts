import { Injectable } from '@nestjs/common';
import globals from "../globals";
import { CommentOptionsDto, MailOptionsDto, SeoDto, UrlDto } from 'shared/dto/configs.dto';

interface IConfig {
  seo: SeoDto
  url: UrlDto
  mailOptions: MailOptionsDto
  commentOptions: CommentOptionsDto

}

const generateDefaultConfig: () => IConfig = () => ({
  seo: {
    title: '这是我的小金间呀',
    description: '哈喽~欢迎光临',
  },
  url: {
    adminUrl: 'http://127.0.0.1:9528',
    serverUrl: 'http://127.0.0.1:2333/api/v' + globals.API_VERSION,
    webUrl: 'http://127.0.0.1:2323',
  },
  mailOptions: {} as MailOptionsDto,
  commentOptions: { antiSpam: false },
})

@Injectable()
export class ConfigsService {
  
}
