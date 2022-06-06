import { Injectable, Logger } from '@nestjs/common';
import globals from "../../globals";
import { CommentOptionsDto, SeoDto, UrlDto } from '../../shared/dto/configs.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Configs } from '../../shared/entities/configs.entity';
import { Repository } from 'typeorm';

interface IConfig {
  seo: SeoDto
  url: UrlDto
  mailOptions: any
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
  mailOptions: {
    enable: 1
  },
  commentOptions: { antiSpam: false },
})

const initData = {
  seo_title: {
    name: 'seo.title',
    // user: 'admin',
    value: JSON.stringify(generateDefaultConfig().seo.title),
  },
  seo_description: {
    name: 'seo.description',
    value: JSON.stringify(generateDefaultConfig().seo.description),
  },
  url_adminUrl: {
    name: 'url.adminUrl',
    value: JSON.stringify(generateDefaultConfig().url.adminUrl),
  },
  url_serverUrl: {
    name: 'url.serverUrl',
    value: JSON.stringify(generateDefaultConfig().url.serverUrl),
  },
  url_webUrl: {
    name: 'url.webUrl',
    value: JSON.stringify(generateDefaultConfig().url.webUrl),
  },
  mailOptions_enable: {
    name: 'mailOptions.enable',
    value: JSON.stringify(generateDefaultConfig().mailOptions.enable),
  },
  themes_default: {
    name: 'theme.performances',
    value: 'default',
  },
  thumbs: {
    name: 'theme.thumbs',
    value: 0,
  }
}
@Injectable()
export class ConfigsService {
  constructor(
    @InjectRepository(Configs)
    private configsRepository: Repository<Configs>
  ){}

  async init() {
    const config = await this.configsRepository.findOne()
    if (!config) {
      await this.configsRepository.save(initData.seo_title)
      await this.configsRepository.save(initData.seo_description)
      await this.configsRepository.save(initData.url_adminUrl)
      await this.configsRepository.save(initData.url_serverUrl)
      await this.configsRepository.save(initData.url_webUrl)
      await this.configsRepository.save(initData.mailOptions_enable)
      await this.configsRepository.save(initData.thumbs)
      Logger.warn('初始化配置成功',ConfigsService.name)
    }
  }
  async change(data: any) {
    const config = await this.configsRepository.findOne({ name: data.name })
    if (config) {
      config.value = data.value
      return await this.configsRepository.update(config.id, config)
    }
  }
  async get(name: string) {
    const config = await this.configsRepository.findOne({ name: name })
    if (config) {
      return JSON.parse(config.value)
    }
    return null
  }
  async all() {
    return await this.configsRepository.find()
  }
  async add(data: Configs) {
    return await this.configsRepository.save(data)
  }
  async delete(id: number) {
    // 并非真正删除，而是把数据恢复回原始数据
    // 并不考虑提供真正的删除功能
    const data = await this.configsRepository.findOne({ id: id })
    if (data) {
      const name = data.name
      return await this.configsRepository.update(id, initData[name])
    }else{
      return 0
    }
  }
  
}
