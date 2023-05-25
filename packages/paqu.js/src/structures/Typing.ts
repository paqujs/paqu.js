import {
    type Client,
    type GatewayTypingStartDispatchData,
    type Snowflake,
    type APIGuildMember,
    GuildMember,
} from '../index';

import { BaseStructure } from './base/BaseStructure';

export class Typing extends BaseStructure {
    public channelId!: Snowflake;
    public guildId!: Snowflake | null;
    public member!: GuildMember | APIGuildMember | null;
    public startedTimestamp!: number;
    public userId!: Snowflake;

    public constructor(client: Client, data: GatewayTypingStartDispatchData) {
        super(client);

        this._patch(data);
    }

    public override _patch(data: GatewayTypingStartDispatchData) {
        this.channelId = data.channel_id;
        this.guildId = data.guild_id ?? null;
        this.member = data.member
            ? this.guild
                ? this.guild.caches.members.cache.setAndReturnValue(
                      data.member.user!.id,
                      new GuildMember(this.client, this.guild, data.member),
                  )
                : data.member
            : null;
        this.startedTimestamp = data.timestamp * 1000;
        this.userId = data.user_id;

        return this;
    }

    public get startedAt() {
        return new Date(this.startedTimestamp);
    }

    public get guild() {
        return this.client.caches.guilds.cache.get(this.guildId!);
    }

    public get user() {
        return this.client.caches.users.cache.get(this.userId);
    }

    public get channel() {
        return this.client.caches.channels.cache.get(this.channelId);
    }
}
