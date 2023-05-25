import { type Client, type Webhook, WebhookMessageManager } from '../../index';

import { BaseManager } from '../base/BaseManager';

export class WebhookCacheManager extends BaseManager {
    public webhook: Webhook;
    public messages: WebhookMessageManager;

    public constructor(client: Client, webhook: Webhook) {
        super(client);

        this.webhook = webhook;

        this.messages = new WebhookMessageManager(client, webhook);
    }
}
