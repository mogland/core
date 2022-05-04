import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ConfigsService } from 'configs/configs.service'
import { render } from 'ejs'
import { createTransport } from 'nodemailer'
import { Configs } from 'shared/entities/configs.entity'
import { isDev } from 'utils/tools.util'

export enum ReplyMailType {
  Owner = 'owner',
  Guest = 'guest',
}

export enum LinkApplyEmailType {
  ToMaster,
  ToCandidate,
}

@Injectable()
export class EmailService {
  private instance: ReturnType<typeof createTransport>
  private logger: Logger
  constructor(
    private readonly configsService: ConfigsService,
  ) {
    this.init()
    this.logger = new Logger(EmailService.name)
  }

  async readTemplate(type: ReplyMailType) {
    switch (type) {
    case ReplyMailType.Guest:
      // return this.assetService.getAsset(
      //   '/email-template/guest.template.ejs',
      //   { encoding: 'utf-8' },
      // )
    case ReplyMailType.Owner:
      // return this.assetService.getAsset(
      //   '/email-template/owner.template.ejs',
      //   { encoding: 'utf-8' },
      // )
    }
  }

  init() {
    this.getConfigFromConfigService()
      .then((config) => {
        this.instance = createTransport({
          ...config,
          secure: true,
          tls: {
            rejectUnauthorized: false,
          },
        })
        this.checkIsReady().then((ready) => {
          if (ready) {
            this.logger.log('送信服务已经加载完毕！')
          }
        })
      })
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .catch(() => {})
  }

  private getConfigFromConfigService() {
    return new Promise<{
      host: string
      port: number
      auth: { user: string; pass: string }
    }>((r, j) => {
      
      // (({ mailOptions }) => {
      // const { MAIL_PORT, MAIL_USER, MAIL_PASSWORD, MAIL_SERVER } = process.env
      const user = process.env.MAIL_USER
      const pass = process.env.MAIL_PASSWORD
      if (!process.env.MAIL_USER && !process.env.MAIL_PASSWORD) {
        const message = '邮件件客户端未认证'
        this.logger.error(message)
        return j(message)
      }
      r({
        host: process.env.MAIL_SERVER,
        port: Number(process.env.MAIL_PORT) || 465,
        auth: { user, pass },
      } as const)
      // })
    })
  }

  async checkIsReady() {
    return !!this.instance && (await this.verifyClient())
  }

  // 验证有效性
  private verifyClient() {
    return new Promise<boolean>((r, j) => {
      this.instance.verify((error) => {
        if (error) {
          this.logger.error('邮件客户端初始化连接失败！')
          r(false)
        } else {
          r(true)
        }
      })
    })
  }
  async sendLinkApplyEmail({
    to,
    model,
    authorName,
    template,
  }: {
    authorName?: string
    to: string
    model: any
    template: LinkApplyEmailType
  }) {
    // const { seo, mailOptions } = await this.configsService.li()
    const seo = await this.configsService.get('seo.title')
    const user = process.env.MAIL_USER
    const from = `"${seo || 'Mx Space'}" <${user}>`
    await this.instance.sendMail({
      from,
      to,
      subject:
        template === LinkApplyEmailType.ToMaster
          ? `[${seo || 'Mx Space'}] 新的朋友 ${authorName}`
          : `嘿!~, 主人已通过你的友链申请!~`,
      text:
        template === LinkApplyEmailType.ToMaster
          ? `来自 ${model.name} 的友链请求: 
          站点标题: ${model.name}
          站点网站: ${model.url}
          站点描述: ${model.description}
        `
          : `你的友链申请: ${model.name}, ${model.url} 已通过`,
    })
  }

  async sendCommentNotificationMail({
    to,
    // source,
    type,
  }: {
    to: string
    // source: EmailTemplateRenderProps
    type: ReplyMailType
  }) {
    const seo = await this.configsService.get('seo.title')
    const user = process.env.MAIL_USER
    const from = `"${seo || 'G Space'}" <${user}>`
    if (type === ReplyMailType.Guest) {
      const options = {
        from,
        ...{
          subject: `[${seo || 'G Space'}] 主人给你了新的回复呐`,
          to,
          // html: this.render((await this.readTemplate(type)) as string, source),
        },
      }
      if (isDev) {
        // delete options.html
        // Object.assign(options, { source })
        this.logger.log(options)
        // return this.instance.sendMail(options)
      }
      await this.instance.sendMail(options)
    } else {
      const options = {
        from,
        ...{
          subject: `[${seo || 'G Space'}] 有新回复了耶~`,
          to,
          // html: this.render((await this.readTemplate(type)) as string, source),
        },
      }
      if (isDev) {
        // delete options.html
        // Object.assign(options, { source })
        this.logger.log(options)
        // return 1
      }
      await this.instance.sendMail(options)
    }
  }

  render(template: string, source: EmailTemplateRenderProps) {
    return render(template, {
      text: source.text,
      time: source.time,
      author: source.author,
      link: source.link,
      ip: source.ip || '',
      title: source.title,
      master: source.master,
      mail: source.mail,
    } as EmailTemplateRenderProps)
  }

  getInstance() {
    return this.instance
  }
}

export interface EmailTemplateRenderProps {
  author: string
  ip?: string
  text: string
  link: string
  time: string
  mail: string
  title: string
  master?: string
}
