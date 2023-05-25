import {
    type APIWebhook,
    type Client,
    type Snowflake,
    type ImageOptions,
    type FetchOptions,
    type EditWebhookData,
    type CreateWebhookMessageData,
    type CreateWebhookMessageOptions,
    type WebhookableChannelResolvable,
    User,
    SnowflakeUtil,
    WebhookCacheManager,
} from '../index';
import { WebhookType } from 'discord-api-types/v10';
import { BaseStructure } from './base/BaseStructure';

export class Webhook extends BaseStructure {
    public applicationId!: string | null;
    public avatar!: string | null;
    public channelId!: Snowflake;
    public guildId!: Snowflake | null;
    public type!: keyof typeof WebhookType;
    public id!: Snowflake;
    public name!: string | null;
    public sourceChannelId!: Snowflake | null;
    public sourceGuildId!: Snowflake | null;
    public token!: string | null;
    public oauth2URL!: string | null;
    public author!: User | null;
    public caches!: WebhookCacheManager;

    public constructor(client: Client, data: APIWebhook) {
        super(client);

        this._patch(data);
    }

    public override _patch(data: APIWebhook) {
        this.applicationId = data.application_id;
        this.avatar = data.avatar;
        this.channelId = data.channel_id;
        this.id = data.id;
        this.name = data.name;
        this.token = data.token ?? null;
        this.type = WebhookType[data.type] as keyof typeof WebhookType;
        this.oauth2URL = data.url ?? null;

        if ('guild_id' in data) {
            this.guildId = data.guild_id;
        } else {
            this.guildId ??= null;
        }

        if ('source_channel_id' in data) {
            this.sourceChannelId = data.source_channel.id;
        } else {
            this.sourceChannelId ??= null;
        }

        if ('source_guild_id' in data) {
            this.sourceGuildId = data.source_guild.id;
        } else {
            this.sourceGuildId ??= null;
        }

        if ('token' in data) {
            this.token = data.token;
        } else {
            this.token ??= null;
        }

        if ('url' in data) {
            this.oauth2URL = data.url;
        } else {
            this.oauth2URL ??= null;
        }

        if ('user' in data) {
            this.author = this.client.caches.users.cache.setAndReturnValue(
                data.user.id,
                new User(this.client, data.user),
            );
        } else {
            this.author ??= null;
        }

        this.caches ??= new WebhookCacheManager(this.client, this);

        return this;
    }

    public get createdTimestamp() {
        return SnowflakeUtil.timestampFrom(this.id);
    }

    public get createdAt() {
        return new Date(this.createdTimestamp);
    }

    public get url() {
        let baseURL = `${this.client.rest._options.baseURL}/webhooks/${this.id}`;

        if (this.token) {
            baseURL += `/${this.token}`;
        }

        return baseURL;
    }

    public get channel() {
        return this.client.caches.channels.cache.get(
            this.channelId,
        ) as WebhookableChannelResolvable;
    }

    public get sourceChannel() {
        return this.client.caches.channels.cache.get(
            this.sourceChannelId!,
        ) as WebhookableChannelResolvable;
    }

    public get guild() {
        return this.client.caches.guilds.cache.get(this.guildId!);
    }

    public get sourceGuild() {
        return this.client.caches.guilds.cache.get(this.sourceGuildId!);
    }

    public avatarURL({ dynamic, size, format }: ImageOptions = { dynamic: true, size: 1024 }) {
        return this.avatar
            ? `https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}.${
                  dynamic && this.avatar.startsWith('a_') ? 'gif' : format ?? 'png'
              }?size=${size ?? 1024}`
            : null;
    }

    public async fetch(options?: FetchOptions) {
        return await this.client.caches.webhooks.fetch(this.id, options);
    }

    public async edit(data: EditWebhookData, reason?: string) {
        return await this.client.caches.webhooks.edit(this.id, data, reason);
    }

    public async delete(reason?: string) {
        return await this.client.caches.webhooks.delete(this.id, this.token, reason);
    }

    public async send(data: CreateWebhookMessageData, options?: CreateWebhookMessageOptions) {
        return await this.caches.messages.create(data, options);
    }

    public async sendSlackMessage(options?: CreateWebhookMessageOptions) {
        return await this.caches.messages.createSlackMessage(options);
    }

    public async sendGitHubMessage(options?: CreateWebhookMessageOptions) {
        return await this.caches.messages.createGithubMessage(options);
    }

    public toString() {
        return this.url;
    }
}
