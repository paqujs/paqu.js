import {
    type APIInteraction,
    type Client,
    type Snowflake,
    type LocalizationMap,
    type APIMessage,
    type APIGuildMember,
    type MessageableChannelResolvable,
    type EditWebhookMessageData,
    type CallbackInteractionOptions,
    type ReplyInteractionData,
    type Message,
    type CreateWebhookMessageData,
    type DeferReplyOptions,
    type APIModalInteractionResponseCallbackData,
    User,
    GuildMember,
    InteractionWebhook,
    SnowflakeUtil,
} from '../../index';
import { InteractionType, InteractionResponseType } from 'discord-api-types/v10';
import { PermissionFlagsBitField } from '@paqujs/bitfields';
import { MessageFlagsBitsResolver, MessageDataResolver } from '@paqujs/resolvers';

import { BaseStructure } from './BaseStructure';

export class BaseInteraction extends BaseStructure {
    public applicationPermissions!: PermissionFlagsBitField;
    public applicationId!: Snowflake;
    public channelId!: Snowflake | null;
    public guildId!: Snowflake | null;
    public guildLocale!: LocalizationMap | null;
    public id!: Snowflake;
    public member!: GuildMember | APIGuildMember | null;
    public message!: Message | APIMessage | null;
    public token!: string;
    public type!: keyof typeof InteractionType;
    public user!: User | null;
    public version!: number;
    public webhook!: InteractionWebhook;

    public constructor(client: Client, data: APIInteraction) {
        super(client);

        data.data;

        this._patch(data);
    }

    public override _patch(data: APIInteraction) {
        this.applicationPermissions = new PermissionFlagsBitField(
            data.app_permissions ? +data.app_permissions : 0,
        );
        this.applicationId = data.application_id;
        this.channelId = data.channel_id ?? null;
        this.guildId = data.guild_id ?? null;
        this.guildLocale = (data.guild_locale as LocalizationMap) ?? null;
        this.id = data.id;
        this.member = data.member ? new GuildMember(this.client, this.guild, data.member) : null;
        this.message = data.message ?? null;
        this.token = data.token;
        this.type = InteractionType[data.type] as keyof typeof InteractionType;
        this.user = data.user
            ? this.client.caches.users.cache.setAndReturnValue(
                  data.user.id,
                  new User(this.client, data.user),
              )
            : this.member.user ?? null;
        this.version = data.version;
        this.webhook = new InteractionWebhook(this.client, {
            id: this.applicationId,
            token: this.token,
        });

        return this;
    }

    public get createdTimestamp() {
        return SnowflakeUtil.timestampFrom(this.id);
    }

    public get createdAt() {
        return new Date(this.createdTimestamp);
    }

    public get channel() {
        return this.client.caches.channels.cache.get(this.channelId!) as
            | MessageableChannelResolvable
            | undefined;
    }

    public get guild() {
        return this.client.caches.guilds.cache.get(this.guildId!);
    }

    public async fetchReply(messageId: Snowflake | '@original' = '@original') {
        return await this.webhook.caches.messages.fetch(messageId);
    }

    public async editReply(
        data: EditWebhookMessageData,
        messageId: Snowflake | '@original' = '@original',
    ) {
        return await this.webhook.caches.messages.edit(messageId, data);
    }

    public async deleteReply(messageId: Snowflake | '@original' = '@original') {
        return await this.webhook.caches.messages.delete(messageId);
    }

    public async followUp(data: CreateWebhookMessageData) {
        return await this.webhook.send(data, {
            wait: undefined,
        });
    }

    public async reply(
        data: ReplyInteractionData | string,
        { fetchReply }: CallbackInteractionOptions = { fetchReply: false },
    ): Promise<Message | void> {
        const { body, files } = await MessageDataResolver(data);

        body.failIfNotExists &&= this.client.options.failIfNotExists;

        await this.client.rest.post(`/interactions/${this.id}/${this.token}/callback`, {
            body: {
                type: InteractionResponseType.ChannelMessageWithSource,
                data: body,
            },
            files,
        });

        if (fetchReply) {
            return await this.fetchReply();
        }

        return undefined;
    }

    public async deferReply(
        options: DeferReplyOptions = { fetchReply: false },
    ): Promise<Message | void> {
        if (options.flags) {
            options.flags = MessageFlagsBitsResolver(options.flags);
        }

        await this.client.rest.post(`/interactions/${this.id}/${this.token}/callback`, {
            body: {
                type: InteractionResponseType.DeferredChannelMessageWithSource,
                data: {
                    flags: MessageFlagsBitsResolver(options?.flags),
                },
            },
        });

        if (options.fetchReply) {
            return await this.fetchReply();
        }

        return undefined;
    }

    public async deferUpdate(
        { fetchReply }: CallbackInteractionOptions = { fetchReply: false },
    ): Promise<Message | void> {
        await this.client.rest.post(`/interactions/${this.id}/${this.token}/callback`, {
            body: {
                type: InteractionResponseType.DeferredMessageUpdate,
            },
        });

        if (fetchReply) {
            return await this.fetchReply();
        }

        return undefined;
    }

    public async update(
        data: ReplyInteractionData | string,
        { fetchReply }: CallbackInteractionOptions = { fetchReply: false },
    ): Promise<Message | void> {
        const { body, files } = await MessageDataResolver(data);

        body.failIfNotExists &&= this.client.options.failIfNotExists;

        await this.client.rest.post(`/interactions/${this.id}/${this.token}/callback`, {
            body: {
                type: InteractionResponseType.UpdateMessage,
                data: body,
            },
            files,
        });

        if (fetchReply) {
            return await this.fetchReply();
        }

        return undefined;
    }

    public async showModal(data: APIModalInteractionResponseCallbackData) {
        return await this.client.rest.post<void>(
            `/interactions/${this.id}/${this.token}/callback`,
            {
                body: {
                    type: InteractionResponseType.Modal,
                    data,
                },
            },
        );
    }
}
