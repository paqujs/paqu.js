import {
    CachedManager,
    type Message,
    type Snowflake,
    type Client,
    type EditWebhookMessageData,
    type CreateWebhookMessageData,
    type CreateWebhookMessageOptions,
    type Webhook,
} from '../../index';

export class WebhookMessageManager extends CachedManager<Snowflake, Message> {
    public webhook: Webhook;

    public constructor(client: Client, channel: Webhook) {
        super(client);

        this.webhook = channel;
    }

    public async fetch(id: Snowflake, threadId?: string) {
        const message = await this.client.caches.webhooks.fetchMessage(
            this.webhook.id,
            this.webhook.token!,
            id,
            threadId,
        );

        return this.cache.setAndReturnValue(message.id, message);
    }

    public delete(id: Snowflake, threadId?: string) {
        this.cache.delete(id);

        return this.client.caches.webhooks.deleteMessage(
            this.webhook.id,
            this.webhook.token!,
            id,
            threadId,
        );
    }

    public async edit(id: Snowflake, data: EditWebhookMessageData, threadId?: string) {
        const message = await this.client.caches.webhooks.editMessage(
            this.webhook.id,
            this.webhook.token!,
            id,
            data,
            threadId,
        );

        return this.cache.setAndReturnValue(message.id, message);
    }

    public async create(data: CreateWebhookMessageData, options?: CreateWebhookMessageOptions) {
        const message = await this.client.caches.webhooks.createMessage(
            this.webhook.id,
            this.webhook.token!,
            data,
            options,
        );

        return message ? this.cache.setAndReturnValue(message.id, message) : undefined;
    }

    public createSlackMessage(options?: CreateWebhookMessageOptions) {
        return this.client.caches.webhooks.createSlackMessage(
            this.webhook.id,
            this.webhook.token!,
            options,
        );
    }

    public createGithubMessage(options?: CreateWebhookMessageOptions) {
        return this.client.caches.webhooks.createGithubMessage(
            this.webhook.id,
            this.webhook.token!,
            options,
        );
    }
}
