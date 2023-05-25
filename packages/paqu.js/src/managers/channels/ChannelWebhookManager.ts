import {
    Webhook,
    type Snowflake,
    type Client,
    type CreateWebhookData,
    type WebhookableChannelResolvable,
    type EditWebhookData,
    type FetchOptions,
} from '../../index';

import { CachedManager } from '../base/CachedManager';

export class ChannelWebhookManager extends CachedManager<Snowflake, Webhook> {
    public channel: WebhookableChannelResolvable;

    public constructor(client: Client, channel: WebhookableChannelResolvable) {
        super(client);

        this.channel = channel;
    }

    public async create(data: CreateWebhookData, reason?: string) {
        return await this.client.caches.webhooks.create(this.channel.id, data, reason);
    }

    public async fetch(id?: string, options?: FetchOptions) {
        const webhooks = await this.client.caches.channels.fetchWebhooks(
            this.channel.id,
            id,
            options,
        );

        if (webhooks instanceof Webhook) {
            return this.cache.setAndReturnValue(id, webhooks);
        } else {
            this.cache.clear();

            for (const webhook of webhooks.values()) {
                this.cache.setAndReturnValue(webhook.id, webhook);
            }

            return this.cache;
        }
    }

    public async edit(data: EditWebhookData, reason?: string) {
        return await this.client.caches.webhooks.edit(this.channel.id, data, reason);
    }

    public async delete(id: Snowflake, reason?: string) {
        return await this.client.caches.webhooks.delete(id, reason);
    }
}
