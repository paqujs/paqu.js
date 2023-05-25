import {
    type APIGuildForumChannel,
    type APITextChannel,
    type Guild,
    type Client,
    type EditChannelData,
    type FetchOptions,
    type CreateMessageData,
    type MessageCollectorOptions,
    GuildTextBasedChannelCacheManager,
    MessageCollector,
} from '../../index';

import { BaseGuildTextChannel } from '../base/BaseGuildTextChannel';

export class TextChannel extends BaseGuildTextChannel {
    public defaultAutoArchiveDuration!: number | null;
    public lastPinTimestamp!: number | null;
    public rateLimitPerUser!: number;
    public topic!: string | null;
    public caches!: GuildTextBasedChannelCacheManager;

    public constructor(client: Client, guild: Guild, data: APITextChannel | APIGuildForumChannel) {
        super(client, guild, data);

        this._patch(data);
    }

    public override _patch(data: APITextChannel | APIGuildForumChannel) {
        super._patch(data);

        this.defaultAutoArchiveDuration = data.default_auto_archive_duration ?? null;
        this.lastPinTimestamp = data.last_pin_timestamp
            ? new Date(data.last_pin_timestamp).getTime()
            : null;
        this.nsfw = data.nsfw ?? false;
        this.rateLimitPerUser = data.rate_limit_per_user ?? 0;
        this.topic = data.topic ?? null;

        this.caches = new GuildTextBasedChannelCacheManager(this.client, this);

        return this;
    }

    public override async fetch(options?: FetchOptions) {
        return (await super.fetch(options)) as TextChannel;
    }

    public override async edit(data: EditChannelData, reason?: string) {
        return (await super.edit(data, reason)) as TextChannel;
    }

    public get lastMessage() {
        return this.caches.messages.cache.get(this.lastMessageId!);
    }

    public async send(data: CreateMessageData | string) {
        return await this.caches.messages.create(data);
    }

    public createMessageCollector(options?: MessageCollectorOptions) {
        return new MessageCollector(this.client, this, options);
    }
}
