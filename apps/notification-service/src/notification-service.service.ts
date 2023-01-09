import { Injectable } from '@nestjs/common';
import { ConfigService } from '~/libs/config/src';
import { HttpService } from '~/libs/helper/src/helper.http.service';

@Injectable()
export class NotificationService {
  constructor(
    private readonly config: ConfigService,
    private readonly http: HttpService,
  ) {}

  async getWebhookInEvent(event: string) {
    const res: string[] = [];
    const webhooks = await this.config.get('webhooks');
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
    const webhooks = await this.getWebhookInEvent(event);
    for (const webhook of webhooks) {
      await this.sendWebhook(webhook, data);
    }
  }
}
