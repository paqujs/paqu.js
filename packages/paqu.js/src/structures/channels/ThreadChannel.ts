import {
    type APIThreadChannel,
    type Guild,
    type Client,
    type FetchOptions,
    type Snowflake,
    type GatewayThreadCreateDispatchData,
    type CreateMessageData,
    ThreadMember,
    ThreadMetadata,
    ThreadChannelCacheManager,
    MessageCollectorOptions,
    MessageCollector,
    ThreadType,
    EditThreadChannelData,
} from '../../index';

import { BaseGuildTextChannel } from '../base/BaseGuildTextChannel';

export class ThreadChannel extends BaseGuildTextChannel {
    public memberCount!: number;
    public messageCount!: number;
    public threadMetadata!: ThreadMetadata | null;
    public totalMessageSent!: number;
    public authorId!: Snowflake | null;
    public rateLimitPerUser!: number;
    public newlyCreated!: boolean;
    public declare type: keyof typeof ThreadType;
    public caches!: ThreadChannelCacheManager;

    public constructor(
        client: Client,
        guild: Guild,
        data: APIThreadChannel | GatewayThreadCreateDispatchData,
    ) {
        super(client, guild, data);

        this._patch(data);
    }

    public override _patch(data: APIThreadChannel | GatewayThreadCreateDispatchData) {
        super._patch(data);

        this.memberCount = data.member_count ?? 1;
        this.messageCount = data.message_count ?? 0;
        this.threadMetadata = data.thread_metadata
            ? new ThreadMetadata(this.client, data.thread_metadata)
            : null;
        this.totalMessageSent = data.total_message_sent ?? 0;
        this.authorId = data.owner_id ?? null;
        this.rateLimitPerUser = data.rate_limit_per_user ?? 0;
        this.type = ThreadType[data.type] as keyof typeof ThreadType;

        if ('newly_created' in data) {
            this.newlyCreated = data.newly_created ?? false;
        } else {
            this.newlyCreated ??= false;
        }

        this.caches = new ThreadChannelCacheManager(this.client, this);

        if (data.member) {
            this.caches.members.cache.set(
                data.member.id!,
                new ThreadMember(this.client, data.member),
            );
        }

        return this;
    }

    public get lastMessage() {
        return this.caches.messages.cache.get(this.lastMessageId!);
    }

    public get author() {
        return this.guild.caches.members.cache.get(this.authorId!);
    }

    public override async fetch(options?: FetchOptions) {
        return (await super.fetch(options)) as ThreadChannel;
    }

    public override async edit(data: EditThreadChannelData, reason?: string) {
        if (!data.archived) {
            data.archived = this.threadMetadata.archived;
        }

        if (!data.auto_archive_duration) {
            data.auto_archive_duration = this.threadMetadata.autoArchiveDuration;
        }

        if (!data.locked) {
            data.locked = this.threadMetadata.locked;
        }

        if (!data.invitable) {
            data.invitable = this.threadMetadata.invitable;
        }

        if (!data.rate_limit_per_user) {
            data.rate_limit_per_user = this.rateLimitPerUser;
        }

        return (await super.edit(data, reason)) as ThreadChannel;
    }

    public async join() {
        return await this.guild.caches.channels.joinThread(this.id);
    }

    public async leave() {
        return await this.guild.caches.channels.leaveThread(this.id);
    }

    public async send(data: CreateMessageData | string) {
        return await this.caches.messages.create(data);
    }

    public createMessageCollector(options?: MessageCollectorOptions) {
        return new MessageCollector(this.client, this, options);
    }
}
