import {
    type Client,
    type GatewayVoiceState,
    type Snowflake,
    type RESTPatchAPIGuildVoiceStateUserJSONBody,
    type VoiceBasedChannelResolvable,
    GuildMember,
} from '../../index';

import { BaseStructure } from '../base/BaseStructure';

export class VoiceState extends BaseStructure {
    public channelId!: Snowflake | null;
    public deaf!: boolean;
    public guildId!: Snowflake | null;
    public member!: GuildMember | null;
    public mute!: boolean;
    public requestToSpeakTimestamp!: number | null;
    public selfDeaf!: boolean;
    public selfMute!: boolean;
    public selfStream!: boolean;
    public sessionId!: string;
    public suppress!: boolean;
    public userId!: Snowflake;

    public constructor(client: Client, data: GatewayVoiceState) {
        super(client);

        this._patch(data);
    }

    public _patch(data: GatewayVoiceState) {
        this.channelId = data.channel_id;
        this.deaf = data.deaf;
        this.guildId = data.guild_id ?? null;
        this.member =
            data.member && this.guild
                ? this.guild.caches.members.cache.setAndReturnValue(
                      data.member.user?.id!,
                      new GuildMember(this.client, this.guild, data.member!),
                  )
                : null;
        this.mute = data.mute;
        this.requestToSpeakTimestamp = data.request_to_speak_timestamp
            ? new Date(data.request_to_speak_timestamp).getTime()
            : null;
        this.selfDeaf = data.self_deaf;
        this.selfMute = data.self_mute;
        this.selfStream = data.self_stream ?? false;
        this.sessionId = data.session_id;
        this.suppress = data.suppress;
        this.userId = data.user_id;

        return this;
    }

    public get channel() {
        return this.client.caches.channels.cache.get(
            this.channelId!,
        ) as VoiceBasedChannelResolvable;
    }

    public get guild() {
        return this.client.caches.guilds.cache.get(this.guildId!);
    }

    public get requestToSpeakAt() {
        return this.requestToSpeakTimestamp ? new Date(this.requestToSpeakTimestamp) : null;
    }

    public get user() {
        return this.client.caches.users.cache.get(this.userId);
    }

    public editUser(data: RESTPatchAPIGuildVoiceStateUserJSONBody) {
        return this.guild ? this.guild.caches.voiceStates.editUser(this.userId, data) : null;
    }

    public toString() {
        return `<@${this.userId}>`;
    }
}
