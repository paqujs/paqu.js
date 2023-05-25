import {
    type APIMessage,
    type Client,
    type Snowflake,
    type GatewayMessageCreateDispatchData,
    type APIGuildMember,
    type EditMessageData,
    type ReplyMessageOptions,
    type GatewayMessageUpdateDispatchData,
    type RoleSubscriptionData,
    MessageActivity,
    User,
    Attachment,
    MessageInteraction,
    MessageMentionManager,
    Sticker,
    MessageCacheManager,
    GuildMember,
    MessageReference,
    SnowflakeUtil,
    TextBasedChannelCacheManager,
    FetchOptions,
    ThreadChannel,
    MessageApplication,
    MessageReactionCollector,
    MessageReactionCollectorOptions,
    MessageComponentCollector,
    MessageComponentCollectorOptions,
    MessageableChannelResolvable,
} from '../../index';
import { MessageActivityType, MessageType } from 'discord-api-types/v10';
import { ActionRowBuilder, EmbedBuilder } from '@paqujs/builders';
import { MessageFlagsBitField } from '@paqujs/bitfields';

import { BaseStructure } from '../base/BaseStructure';

export class Message extends BaseStructure {
    public guildId!: Snowflake | null;
    public activity!: MessageActivity | null;
    public application!: MessageApplication;
    public applicationId!: Snowflake | null;
    public attachments!: Attachment[];
    public author!: User | null;
    public channelId!: Snowflake;
    public components!: ActionRowBuilder[];
    public content!: string | null;
    public editedTimestamp!: number | null;
    public embeds!: EmbedBuilder[];
    public flags!: MessageFlagsBitField;
    public id!: Snowflake;
    public interaction!: MessageInteraction | null;
    public mentions!: MessageMentionManager;
    public messageReference!: MessageReference | null;
    public nonce!: string | number | null;
    public pinned!: boolean;
    public rawPosition!: number | null;
    public caches!: MessageCacheManager;
    public stickers!: Sticker[];
    public thread!: ThreadChannel | null;
    public tts!: boolean;
    public type!: keyof typeof MessageType;
    public webhookId!: Snowflake | null;
    public member!: GuildMember | null;
    public referencedMessage!: Message | null;
    public roleSubscriptionData!: RoleSubscriptionData | null;

    public constructor(
        client: Client,
        data: APIMessage | GatewayMessageCreateDispatchData | GatewayMessageUpdateDispatchData,
    ) {
        super(client);

        this._patch(data);
    }

    public override _patch(
        data: APIMessage | GatewayMessageCreateDispatchData | GatewayMessageUpdateDispatchData,
    ) {
        this.channelId = data.channel_id;
        this.flags = new MessageFlagsBitField(data.flags ?? 0);
        this.id = data.id;
        this.mentions = new MessageMentionManager(
            this.client,
            data.mentions,
            data.mention_roles,
            data.mention_channels,
            data.mention_everyone,
            this.guild,
        );
        this.caches ??= new MessageCacheManager(this, data.reactions ?? [], this.client);
        this.stickers = [];

        if ('application' in data) {
            this.application = data.application
                ? new MessageApplication(this.client, data.application)
                : null;
        } else {
            this.application ??= null;
        }

        if ('activity' in data) {
            this.activity = data.activity
                ? {
                      type: MessageActivityType[data.type!] as keyof typeof MessageActivityType,
                      partyId: data.activity.party_id ?? null,
                  }
                : null;
        } else {
            this.activity ??= null;
        }

        if ('guild_id' in data) {
            this.guildId = data.guild_id ?? null;
        } else {
            this.guildId ??= null;
        }

        if (!this.guildId && this.channel && 'guild' in this.channel) {
            this.guildId = this.channel.guild.id;
        }

        if ('author' in data) {
            this.author = this.client.caches.users.cache.setAndReturnValue(
                data.author.id,
                new User(this.client, data.author),
            );
        } else {
            this.author ??= null;
        }

        if ('interaction' in data) {
            this.interaction = data.interaction
                ? new MessageInteraction(this.client, data.interaction)
                : null;
        } else {
            this.interaction ??= null;
        }

        if ('message_reference' in data) {
            this.messageReference = data.message_reference
                ? new MessageReference(this.client, data.message_reference)
                : null;
        } else {
            this.messageReference ??= null;
        }

        if ('nonce' in data) {
            this.nonce = data.nonce ?? null;
        } else {
            this.nonce ??= null;
        }

        if ('pinned' in data) {
            this.pinned = data.pinned ?? false;
        } else {
            this.pinned = false;
        }

        if ('position' in data) {
            this.rawPosition = data.position ?? null;
        } else {
            this.rawPosition ??= null;
        }

        if ('thread' in data) {
            this.thread = this.client.caches.channels._createChannel(
                data.thread,
                this.guild,
            ) as ThreadChannel;
        } else {
            this.thread ??= null;
        }

        if ('tts' in data) {
            this.tts = data.tts ?? false;
        }

        if ('components' in data) {
            this.components = data.components
                ? data.components.map(({ components }) => ActionRowBuilder.from(components))
                : [];
        } else {
            this.components ??= [];
        }

        if ('type' in data) {
            this.type = MessageType[data.type!] as keyof typeof MessageType;
        } else {
            this.type = 'Default';
        }

        if ('webhook_id' in data) {
            this.webhookId = data.webhook_id ?? null;
        } else {
            this.webhookId = null;
        }

        if ('application_id' in data) {
            this.applicationId = data.application_id ?? null;
        } else {
            this.applicationId ??= null;
        }

        if ('author' in data) {
            this.author = data.author
                ? this.client.caches.users.cache.setAndReturnValue(
                      data.author.id,

                      new User(this.client, data.author),
                  )
                : null;
        }

        if ('attachments' in data) {
            this.attachments = data.attachments
                ? data.attachments.map((attachment) => new Attachment(attachment))
                : [];
        } else {
            this.attachments ??= [];
        }

        if ('content' in data) {
            this.content = data.content ?? null;
        } else {
            this.content ??= null;
        }

        if ('embeds' in data) {
            this.embeds = data.embeds ? data.embeds.map((embed) => new EmbedBuilder(embed)) : [];
        } else {
            this.embeds ??= [];
        }

        if ('edited_timestamp' in data) {
            this.editedTimestamp = data.edited_timestamp
                ? new Date(data.edited_timestamp).getTime()
                : null;
        } else {
            this.editedTimestamp ??= null;
        }

        for (const sticker of data.sticker_items ?? []) {
            const _sticker = this.client.caches.stickers.cache.get(sticker.id);

            if (_sticker) {
                this.stickers.push(_sticker);
            }
        }

        if ('member' in data) {
            if (this.guild) {
                let _member = this.guild.caches.members.cache.get(this.author.id);

                if (_member) {
                    _member = _member._patch(data.member);
                } else {
                    _member = this.guild.caches.members.cache.setAndReturnValue(
                        this.author.id,
                        new GuildMember(this.client, this.guild, data.member as APIGuildMember),
                    );
                }

                this.member = _member;
            } else {
                this.member ??= null;
            }
        } else if (this.guild) {
            this.member ??= this.guild.caches.members.cache.get(this.author.id) ?? null;
        }

        if ('referenced_message' in data) {
            this.referencedMessage = data.referenced_message
                ? new Message(this.client, data.referenced_message)
                : null;
        } else {
            this.referencedMessage ??= null;
        }

        if ('role_subscription_data' in data) {
            this.roleSubscriptionData = data.role_subscription_data
                ? {
                      isRenewal: data.role_subscription_data.is_renewal,
                      roleSubscriptionListingId:
                          data.role_subscription_data.role_subscription_listing_id,
                      tierName: data.role_subscription_data.tier_name,
                      totalMonthsSubscribed: data.role_subscription_data.total_months_subscribed,
                  }
                : null;
        } else {
            this.roleSubscriptionData ??= null;
        }

        return this;
    }

    public get createdTimestamp() {
        return SnowflakeUtil.timestampFrom(this.id);
    }

    public get createdAt() {
        return new Date(this.createdTimestamp);
    }

    public get editedAt() {
        return this.editedTimestamp ? new Date(this.editedTimestamp) : null;
    }

    public get guild() {
        return this.client.caches.guilds.cache.get(this.guildId!);
    }

    public get channel(): MessageableChannelResolvable | undefined {
        return this.client.caches.channels.cache.get(
            this.channelId!,
        ) as MessageableChannelResolvable;
    }

    public get position() {
        return this.channel
            ? this.channel.caches?.messages.cache.keyArray().indexOf(this.id)
            : null;
    }

    public get url() {
        return `https://discordapp.com/channels/${this.guildId ?? '@me'}/${this.channelId}/${
            this.id
        }`;
    }

    public inGuild() {
        return !!this.guildId;
    }

    public async fetch() {
        return this.channel?.caches.messages.fetch(this.id) as Promise<Message>;
    }

    public async delete(reason?: string) {
        return this.channel?.caches.messages.delete(this.id, reason);
    }

    public async edit(data: EditMessageData) {
        return this.channel?.caches.messages.edit(this.id, data);
    }

    public async reply(data: ReplyMessageOptions, failIfNotExists?: boolean) {
        return await this.channel?.caches.messages.create({
            ...data,
            message_reference: {
                channel_id: this.channelId,
                guild_id: this.guildId!,
                message_id: this.id,
                fail_if_not_exists: failIfNotExists,
            },
        });
    }

    public async pin(reason?: string) {
        return (this.channel?.caches as TextBasedChannelCacheManager).pins.create(this.id, reason);
    }

    public async unpin(reason?: string) {
        return (this.channel?.caches as TextBasedChannelCacheManager).pins.delete(this.id, reason);
    }

    public async fetchWebhook(options?: FetchOptions) {
        return this.client.caches.webhooks.fetch(this.webhookId!, options);
    }

    public createReactionCollector(options?: MessageReactionCollectorOptions) {
        return new MessageReactionCollector(this.client, this, options);
    }

    public createComponentCollector(options?: MessageComponentCollectorOptions) {
        return new MessageComponentCollector(this.client, this, options);
    }

    public async crosspost() {
        return await this.channel.caches.messages.crosspost(this.id);
    }

    public async react(emoji: string) {
        return await this.caches.reactions.create(emoji);
    }

    public async unreact(emoji: string, userId: Snowflake | '@me') {
        return await this.caches.reactions.delete(emoji, userId);
    }
}
