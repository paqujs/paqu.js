import {
    type Client,
    type InteractionWebhook,
    InteractionWebhookMessageManager,
} from '../../index';

import { BaseManager } from '../base/BaseManager';

export class InteractionWebhookCacheManager extends BaseManager {
    public webhook: InteractionWebhook;
    public messages: InteractionWebhookMessageManager;

    public constructor(client: Client, webhook: InteractionWebhook) {
        super(client);

        this.webhook = webhook;

        this.messages = new InteractionWebhookMessageManager(client, webhook);
    }
}
