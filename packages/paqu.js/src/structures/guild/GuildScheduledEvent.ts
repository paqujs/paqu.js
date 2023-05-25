import {
    type Client,
    type APIGuildScheduledEvent,
    type APIGuildScheduledEventEntityMetadata,
    type Snowflake,
    type EditGuildScheduledEventData,
    type ImageOptions,
    type FetchGuildScheduledEventOptions,
    type CreateInviteData,
    User,
    SnowflakeUtil,
    VoiceChannel,
    StageChannel,
} from '../../index';
import {
    GuildScheduledEventEntityType,
    GuildScheduledEventPrivacyLevel,
    GuildScheduledEventStatus,
} from 'discord-api-types/v10';
import { BaseStructure } from '../base/BaseStructure';

export class GuildScheduledEvent extends BaseStructure {
    public channelId!: Snowflake | null;
    public author!: User | null;
    public description!: string | null;
    public entityId!: Snowflake | null;
    public entityMetadata!: APIGuildScheduledEventEntityMetadata | null;
    public entityType!: keyof typeof GuildScheduledEventEntityType;
    public guildId!: Snowflake;
    public id!: Snowflake;
    public image!: string | null;
    public name!: string;
    public privacyLevel!: keyof typeof GuildScheduledEventPrivacyLevel;
    public endTimestamp!: number | null;
    public startTimestamp!: number;
    public status!: keyof typeof GuildScheduledEventStatus;
    public userCount!: number | null;

    public constructor(client: Client, data: APIGuildScheduledEvent) {
        super(client);

        this._patch(data);
    }

    public override _patch(data: APIGuildScheduledEvent) {
        this.channelId = data.channel_id;
        this.author = data.creator ? new User(this.client, data.creator) : null;
        this.description = data.description ?? null;
        this.entityId = data.entity_id;
        this.entityMetadata = data.entity_metadata;
        this.entityType = GuildScheduledEventEntityType[
            data.entity_type
        ] as keyof typeof GuildScheduledEventEntityType;
        this.guildId = data.guild_id;
        this.id = data.id;
        this.image = data.image ?? null;
        this.name = data.name;
        this.privacyLevel = GuildScheduledEventPrivacyLevel[
            data.privacy_level
        ] as keyof typeof GuildScheduledEventPrivacyLevel;
        this.endTimestamp = data.scheduled_end_time
            ? new Date(data.scheduled_end_time).getTime()
            : null;
        this.startTimestamp = new Date(data.scheduled_start_time).getTime();
        this.status = GuildScheduledEventStatus[
            data.status
        ] as keyof typeof GuildScheduledEventStatus;
        this.userCount = data.user_count ?? null;

        return this;
    }

    public get createdTimestamp() {
        return SnowflakeUtil.timestampFrom(this.id);
    }

    public get createdAt() {
        return new Date(this.createdTimestamp);
    }

    public get endAt() {
        return this.endTimestamp ? new Date(this.endTimestamp) : null;
    }

    public get startAt() {
        return new Date(this.startTimestamp);
    }

    public get channel() {
        return this.guild?.caches.channels.cache.get(this.channelId!) as
            | VoiceChannel
            | StageChannel
            | undefined;
    }

    public get guild() {
        return this.client.caches.guilds.cache.get(this.guildId);
    }

    public get url() {
        return `https://discord.com/events/${this.guildId}/${this.id}`;
    }

    public imageURL({ dynamic, size, format }: ImageOptions = { dynamic: true, size: 1024 }) {
        return this.image
            ? `https://cdn.discordapp.com/guild-events/${this.id}/${this.image}.${
                  dynamic && this.image.startsWith('a_') ? 'gif' : format ?? 'png'
              }?size=${size ?? 1024}`
            : null;
    }

    public async delete(reason?: string) {
        await this.guild!.caches.scheduledEvents.delete(this.id, reason);
    }

    public async edit(data: EditGuildScheduledEventData, reason?: string) {
        return await this.guild!.caches.scheduledEvents.edit(this.id, data, reason);
    }

    public async fetch(options?: FetchGuildScheduledEventOptions) {
        return await this.guild!.caches.scheduledEvents.fetch(this.id, options);
    }

    public async fetchUsers() {
        return await this.guild!.caches.scheduledEvents.fetchUsers(this.id);
    }

    public async createInvite(data: CreateInviteData, reason?: string) {
        return await this.channel?.caches.invites.create(data, reason)!;
    }

    public toString() {
        return this.url;
    }
}
