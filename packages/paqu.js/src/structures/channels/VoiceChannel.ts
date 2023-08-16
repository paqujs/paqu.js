import {
    type APIGuildVoiceChannel,
    type Guild,
    type Client,
    type EditChannelData,
    type FetchOptions,
    type CreateMessageData,
    type Snowflake,
    type MessageCollectorOptions,
    VoiceChannelCacheManager,
    MessageCollector,
} from '../../index';
import { VideoQualityMode } from 'discord-api-types/v10';
import { BaseVoiceChannel } from '../base/BaseVoiceChannel';

export class VoiceChannel extends BaseVoiceChannel {
    public videoQualityMode!: keyof typeof VideoQualityMode;
    public lastMessageId!: Snowflake | null;
    public declare caches: VoiceChannelCacheManager;

    public constructor(client: Client, guild: Guild, data: APIGuildVoiceChannel) {
        super(client, guild, data);

        this._patch(data);
    }

    public override _patch(data: APIGuildVoiceChannel) {
        super._patch(data);

        this.videoQualityMode = VideoQualityMode[
            data.video_quality_mode ?? 1
        ] as keyof typeof VideoQualityMode;
        this.lastMessageId = data.last_message_id ?? null;

        this.caches = new VoiceChannelCacheManager(this.client, this);

        return this;
    }

    public override fetch(options?: FetchOptions) {
        return super.fetch(options) as Promise<VoiceChannel>;
    }

    public override edit(data: EditChannelData, reason?: string) {
        return super.edit(data, reason) as Promise<VoiceChannel>;
    }

    public send(data: CreateMessageData | string) {
        return this.caches.messages.create(data);
    }

    public get lastMessage() {
        return this.caches.messages.cache.get(this.lastMessageId!);
    }

    public createMessageCollector(options?: MessageCollectorOptions) {
        return new MessageCollector(this.client, this, options);
    }
}
