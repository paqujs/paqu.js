import {
    type Snowflake,
    type FetchOptions,
    type CreateWebhookData,
    type APIWebhook,
    type EditWebhookData,
    type APIMessage,
    type EditWebhookMessageData,
    type CreateWebhookMessageData,
    type CreateWebhookMessageOptions,
    Webhook,
    Client,
    Message,
} from '../../index';
import { DataResolver, MessageDataResolver } from '@paqujs/resolvers';
import { Collection } from '@paqujs/shared';
import { CachedManager } from '../base/CachedManager';

export class ClientWebhookManager extends CachedManager<Snowflake, Webhook> {
    public constructor(client: Client) {
        super(client);
    }

    public async create(id: Snowflake, data: CreateWebhookData, reason?: string) {
        if (data.avatar) {
            const resolvedImage = await DataResolver.resolveImage(data.avatar);

            data.avatar = resolvedImage;
        }

        const webhook = await this.client.rest.post<APIWebhook>(`/channels/${id}/webhooks`, {
            body: data,
            reason: reason,
        });

        return this.cache.setAndReturnValue(webhook.id, new Webhook(this.client, webhook));
    }

    public async fetch(id: Snowflake, { force }: FetchOptions = { force: false }) {
        let _webhook = this.cache.get(id);

        if (!force && _webhook) {
            return _webhook;
        } else {
            const webhook = await this.client.rest.get<APIWebhook>(`/webhooks/${id}`);

            if (_webhook) {
                _webhook = _webhook._patch(webhook);
            }

            return this.cache.setAndReturnValue(
                webhook.id,
                _webhook ?? new Webhook(this.client, webhook),
            );
        }
    }

    public async fetchGuildWebhooks(id: Snowflake): Promise<Collection<Snowflake, Webhook>> {
        const webhooks = await this.client.rest.get<APIWebhook[]>(`/guilds/${id}/webhooks`);
        return new Collection(
            webhooks.map((webhook) => [webhook.id, new Webhook(this.client, webhook)]),
        );
    }

    public async edit(id: Snowflake, data: EditWebhookData, reason?: string) {
        if (data.avatar) {
            const resolvedImage = await DataResolver.resolveImage(data.avatar);

            data.avatar = resolvedImage;
        }

        const webhook = await this.client.rest.patch<APIWebhook>(`/webhooks/${id}`, {
            body: data,
            reason: reason,
        });

        return this.cache.setAndReturnValue(webhook.id, new Webhook(this.client, webhook));
    }

    public delete(id: Snowflake, token?: string | null, reason?: string) {
        return this.client.rest.delete<void>(`/webhooks/${id}${token ? `/${token}` : ''}`, {
            reason: reason,
        });
    }

    public async createMessage(
        id: Snowflake,
        token: string,
        data: CreateWebhookMessageData,
        { wait, thread_id }: CreateWebhookMessageOptions = { wait: true },
    ) {
        const { body, files } = await MessageDataResolver(data);

        body.failIfNotExists &&= this.client.options.failIfNotExists;

        const message = await this.client.rest.post<APIMessage>(`/webhooks/${id}/${token}`, {
            body,
            files,
            query: { thread_id, wait },
        });

        return wait ? new Message(this.client, message) : undefined;
    }

    public async fetchMessage(
        webhookId: Snowflake,
        token: string,
        messageId: Snowflake,
        threadId?: Snowflake,
    ) {
        const message = await this.client.rest.get<APIMessage>(
            `/webhooks/${webhookId}/${token}/messages/${messageId}`,
            {
                query: { thread_id: threadId },
            },
        );

        return new Message(this.client, message);
    }

    public async editMessage(
        webhookId: Snowflake,
        token: string,
        messageId: Snowflake,
        data: EditWebhookMessageData,
        threadId?: Snowflake,
    ) {
        const { body, files } = await MessageDataResolver(data);

        body.failIfNotExists &&= this.client.options.failIfNotExists;

        const message = await this.client.rest.patch<APIMessage>(
            `/webhooks/${webhookId}/${token}/messages/${messageId}`,
            {
                body,
                query: { thread_id: threadId },
                files,
            },
        );

        return new Message(this.client, message);
    }

    public deleteMessage(
        webhookId: Snowflake,
        token: string,
        messageId: Snowflake,
        threadId?: Snowflake,
    ) {
        return this.client.rest.delete<void>(
            `/webhooks/${webhookId}/${token}/messages/${messageId}`,
            {
                query: { thread_id: threadId },
            },
        );
    }

    public async createSlackMessage(
        id: Snowflake,
        token: Snowflake,
        options?: CreateWebhookMessageOptions,
    ) {
        const data = await this.client.rest.post<any>(`/webhooks/${id}/${token}/slack`, {
            query: options,
        });

        return data.toString() === 'ok';
    }

    public async createGithubMessage(
        id: Snowflake,
        token: Snowflake,
        options?: CreateWebhookMessageOptions,
    ) {
        const data = await this.client.rest.post<any>(`/webhooks/${id}/${token}/github`, {
            query: options,
        });

        return data.toString() === 'ok';
    }
}
