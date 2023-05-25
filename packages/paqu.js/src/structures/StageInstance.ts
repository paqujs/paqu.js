import type {
    APIStageInstance,
    Client,
    Snowflake,
    EditStageInstanceData,
    FetchOptions,
} from '../index';
import { StageInstancePrivacyLevel } from 'discord-api-types/v10';
import { BaseStructure } from './base/BaseStructure';

export class StageInstance extends BaseStructure {
    public channelId!: Snowflake;
    public guildId!: Snowflake;
    public scheduledEventId!: Snowflake | null;
    public id!: Snowflake;
    public privacyLevel!: keyof typeof StageInstancePrivacyLevel;
    public topic!: string;

    public constructor(client: Client, data: APIStageInstance) {
        super(client);

        this._patch(data);
    }

    public override _patch(data: APIStageInstance) {
        this.channelId = data.channel_id;
        this.guildId = data.guild_id;
        this.scheduledEventId = data.guild_scheduled_event_id ?? null;
        this.id = data.id;
        this.privacyLevel = StageInstancePrivacyLevel[
            data.privacy_level
        ] as keyof typeof StageInstancePrivacyLevel;
        this.topic = data.topic;

        return this;
    }

    public get channel() {
        return this.guild!.caches.channels.cache.get(this.channelId);
    }

    public get guild() {
        return this.client.caches.guilds.cache.get(this.guildId);
    }

    public get scheduledEvent() {
        return this.guild!.caches.scheduledEvents.cache.get(this.scheduledEventId!);
    }

    public async delete(reason?: string) {
        return await this.client.caches.stageInstances.delete(this.id, reason);
    }

    public async edit(data: EditStageInstanceData, reason?: string) {
        return await this.client.caches.stageInstances.edit(this.id, data, reason);
    }

    public async fetch(options?: FetchOptions) {
        return await this.client.caches.stageInstances.fetch(this.id, options);
    }

    public toString() {
        return this.channel!.toString();
    }
}
