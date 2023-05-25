import {
    type APINewsChannel,
    type Guild,
    type Client,
    type Snowflake,
    type EditChannelData,
    type FetchOptions,
    type CreateMessageData,
    type MessageCollectorOptions,
    GuildTextBasedChannelCacheManager,
    MessageCollector,
} from '../../index';

import { BaseGuildTextChannel } from '../base/BaseGuildTextChannel';

export class AnnouncementChannel extends BaseGuildTextChannel {
    public defaultAutoArchiveDuration!: number | null;
    public lastPinTimestamp!: number | null;
    public topic!: string | null;
    public caches!: GuildTextBasedChannelCacheManager;

    public constructor(client: Client, guild: Guild, data: APINewsChannel) {
        super(client, guild, data);

        this._patch(data);
    }

    public override _patch(data: APINewsChannel) {
        super._patch(data);

        this.defaultAutoArchiveDuration = data.default_auto_archive_duration ?? null;
        this.lastPinTimestamp = data.last_pin_timestamp
            ? new Date(data.last_pin_timestamp).getTime()
            : null;
        this.topic = data.topic ?? null;

        this.caches = new GuildTextBasedChannelCacheManager(this.client, this);

        return this;
    }

    public get lastPinAt() {
        return this.lastPinTimestamp ? new Date(this.lastPinTimestamp) : null;
    }

    public async follow(webhookId: Snowflake) {
        return await this.guild.caches.channels.followAnnouncementChannel(this.id, webhookId);
    }

    public override async fetch(options?: FetchOptions) {
        return (await super.fetch(options)) as AnnouncementChannel;
    }

    public override async edit(data: EditChannelData, reason?: string) {
        return (await super.edit(data, reason)) as AnnouncementChannel;
    }

    public async send(data: CreateMessageData | string) {
        return await this.caches.messages.create(data);
    }

    public get lastMessage() {
        return this.caches.messages.cache.get(this.lastMessageId!);
    }

    public createMessageCollector(options?: MessageCollectorOptions) {
        return new MessageCollector(this.client, this, options);
    }
}
