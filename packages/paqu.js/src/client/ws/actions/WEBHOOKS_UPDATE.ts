import { type GatewayWebhooksUpdateDispatch, WebhookableChannelResolvable } from '../../../index';
import { BaseAction } from './BaseAction';

export class WEBHOOKS_UPDATE extends BaseAction {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayWebhooksUpdateDispatch) {
        const channel = this.handler.client.caches.channels.cache.get(
            d.channel_id,
        ) as WebhookableChannelResolvable;

        if (channel) {
            this.handler.emit('webhooksUpdate', channel);
        }
    }
}
