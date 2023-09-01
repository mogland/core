import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { HttpService } from '~/libs/helper/src/helper.http.service';
import { ConfigEvents } from '~/shared/constants/event.constant';
import { ServicesEnum } from '~/shared/constants/services.constant';
import { transportReqToMicroservice } from '~/shared/microservice.transporter';

@Injectable()
export class NotificationService {
  private logger: Logger;
  constructor(
    @Inject(ServicesEnum.config)    
    private readonly config: ClientProxy,
    private readonly http: HttpService,
  ) {
    this.logger = new Logger(NotificationService.name);
  }

  async getWebhookInEvent(event: string) {
    const res: string[] = [];
    const webhooks = await transportReqToMicroservice(
      this.config,
      ConfigEvents.ConfigGetByMaster,
      'webhooks',
    );
    if (!webhooks) return;
    for (const webhook of webhooks) {
      if (webhook.events.includes(event)) {
        res.push(webhook.url);
      }
      if (webhook.events.includes('*')) {
        res.push(webhook.url);
      }
    }
    return res;
  }

  async sendWebhook(url: string, data: any) {
    return await this.http.axiosRef.post(url, {
      data,
    });
  }

  async sendEvent(event: string, data: any) {
    console.log('sendEvent', event);
    const webhooks = await this.getWebhookInEvent(event);
    if (!webhooks) return;
    for (const webhook of webhooks) {
      await this.sendWebhook(webhook, data);
    }
  }
}
