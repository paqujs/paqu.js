import type {
    Message,
    Snowflake,
    Client,
    InteractionWebhook,
    EditWebhookMessageData,
    CreateWebhookMessageData,
    CreateWebhookMessageOptions,
} from '../../index';

import { CachedManager } from '../base/CachedManager';

export class InteractionWebhookMessageManager extends CachedManager<Snowflake, Message> {
    public webhook: InteractionWebhook;

    public constructor(client: Client, webhook: InteractionWebhook) {
        super(client);

        this.webhook = webhook;
    }

    public async fetch(id: Snowflake | '@original'): Promise<Message> {
        return this.client.caches.webhooks.fetchMessage(this.webhook.id, this.webhook.token, id);
    }

    public async edit(id: Snowflake | '@original', data: EditWebhookMessageData): Promise<Message> {
        return this.client.caches.webhooks.editMessage(
            this.webhook.id,
            this.webhook.token,
            id,
            data,
        );
    }

    public async delete(id: Snowflake | '@original'): Promise<void> {
        return this.client.caches.webhooks.deleteMessage(this.webhook.id, this.webhook.token, id);
    }

    public async create(
        data: CreateWebhookMessageData,
        options?: CreateWebhookMessageOptions,
    ): Promise<Message> {
        return this.client.caches.webhooks.createMessage(
            this.webhook.id,
            this.webhook.token,
            data,
            options,
        );
    }
}
