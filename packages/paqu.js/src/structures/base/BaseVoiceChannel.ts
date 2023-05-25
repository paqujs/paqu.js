import {
    type APIVoiceBasedChannelResolvable,
    type Guild,
    type Client,
    type EditChannelData,
    type FetchOptions,
    type VoiceBasedChannelResolvable,
    GuildChannelCacheManager,
} from '../../index';

import { BaseGuildChannel } from '../base/BaseGuildChannel';

export class BaseVoiceChannel extends BaseGuildChannel {
    public bitrate!: number;
    public nsfw!: boolean;
    public rtcRegion!: string | null;
    public userLimit!: number;
    public caches!: GuildChannelCacheManager;

    public constructor(client: Client, guild: Guild, data: APIVoiceBasedChannelResolvable) {
        super(client, guild, data);

        this._patch(data);
    }

    public override _patch(data: APIVoiceBasedChannelResolvable) {
        super._patch(data);

        this.bitrate = data.bitrate ?? 64;
        this.nsfw = data.nsfw ?? false;
        this.rtcRegion = data.rtc_region ?? null;
        this.userLimit = data.user_limit ?? 0;

        this.caches = new GuildChannelCacheManager(
            this.client,
            this as unknown as VoiceBasedChannelResolvable,
        );

        return this;
    }

    public get members() {
        return this.guild.caches.members.cache.filter(
            (member) => member.voice?.channelId === this.id,
        );
    }

    public override async fetch(options?: FetchOptions) {
        return (await super.fetch(options)) as VoiceBasedChannelResolvable;
    }

    public override async edit(data: EditChannelData, reason?: string) {
        return (await super.edit(data, reason)) as VoiceBasedChannelResolvable;
    }

    public toString() {
        return `<#!${this.id}>`;
    }
}
