import {
    Client,
    GatewayMessageReactionAddDispatchData,
    Snowflake,
    GuildEmoji,
    APIEmoji,
    GuildMember,
    APIGuildMember,
    MessageableChannelResolvable,
    GatewayMessageReactionRemoveEmojiDispatchData,
} from '../index';

import { BaseStructure } from './base/BaseStructure';

export class MessageReaction extends BaseStructure {
    public channelId!: Snowflake;
    public guildId!: Snowflake | null;
    public emoji!: APIEmoji | GuildEmoji;
    public member!: GuildMember | APIGuildMember | null;
    public messageId!: Snowflake;
    public userId!: Snowflake | null;

    public constructor(
        client: Client,
        data: GatewayMessageReactionAddDispatchData | GatewayMessageReactionRemoveEmojiDispatchData,
    ) {
        super(client);

        this._patch(data);
    }

    public override _patch(
        data: GatewayMessageReactionAddDispatchData | GatewayMessageReactionRemoveEmojiDispatchData,
    ) {
        this.channelId = data.channel_id;
        this.guildId = data.guild_id ?? null;
        this.emoji = this.guild
            ? this.guild.caches.emojis.cache.setAndReturnValue(
                  data.emoji.id!,
                  new GuildEmoji(this.client, this.guild, data.emoji),
              )
            : data.emoji;

        this.messageId = data.message_id;

        if ('member' in data) {
            this.member = data.member
                ? this.guild
                    ? this.guild.caches.members.cache.setAndReturnValue(
                          data.member.user!.id,
                          new GuildMember(this.client, this.guild, data.member),
                      )
                    : data.member
                : null;
        } else {
            this.member ??= null;
        }

        if ('user_id' in data) {
            this.userId = data.user_id;
        } else {
            this.userId ??= null;
        }

        return this;
    }

    public get guild() {
        return this.client.caches.guilds.cache.get(this.guildId!);
    }

    public get user() {
        return this.client.caches.users.cache.get(this.userId!);
    }

    public get channel() {
        return this.client.caches.channels.cache.get(
            this.channelId,
        ) as MessageableChannelResolvable;
    }

    public get message() {
        return this.channel!.caches.messages.cache.get(this.messageId);
    }
}
