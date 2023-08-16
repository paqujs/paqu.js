import {
    type Snowflake,
    type Client,
    type APIChannel,
    type EditChannelData,
    type APIMessage,
    type AnyChannel,
    type EditMessageData,
    type CreateMessageData,
    type Collectionable,
    type FetchOptions,
    type TextBasedChannelResolvable,
    type APIWebhook,
    Message,
    GroupDMChannel,
    TextChannel,
    VoiceChannel,
    DMChannel,
    Guild,
    CategoryChannel,
    StageChannel,
    ThreadChannel,
    AnnouncementChannel,
    TextBasedChannelCacheManager,
    ForumChannel,
    MessageableChannelResolvable,
    Webhook,
} from '../../index';
import { ChannelType } from 'discord-api-types/v10';
import { Collection } from '@paqujs/shared';
import { MessageDataResolver, ChannelDataResolver } from '@paqujs/resolvers';

import { CachedManager } from '../base/CachedManager';

export class ClientChannelManager extends CachedManager<Snowflake, AnyChannel> {
    public constructor(client: Client) {
        super(client);
    }

    public _createChannel(data: APIChannel, guild?: Guild): AnyChannel {
        let channel;

        switch (data.type) {
            case ChannelType.DM:
                channel = new DMChannel(this.client, data);
                break;
            case ChannelType.GroupDM:
                channel = new GroupDMChannel(this.client, data);
                break;
        }

        if (guild) {
            switch (data.type) {
                case ChannelType.GuildCategory:
                    channel = new CategoryChannel(this.client, guild, data);
                    break;
                case ChannelType.GuildAnnouncement:
                    channel = new AnnouncementChannel(this.client, guild, data);
                    break;
                case ChannelType.AnnouncementThread:
                case ChannelType.PrivateThread:
                case ChannelType.PublicThread:
                    channel = new ThreadChannel(this.client, guild, data);
                    break;
                case ChannelType.GuildStageVoice:
                    channel = new StageChannel(this.client, guild, data);
                    break;
                case ChannelType.GuildText:
                    channel = new TextChannel(this.client, guild, data);
                    break;
                case ChannelType.GuildVoice:
                    channel = new VoiceChannel(this.client, guild, data);
                    break;
                case ChannelType.GuildForum:
                    channel = new ForumChannel(this.client, guild, data);
                    break;
            }
        }

        return channel;
    }

    public delete(id: Snowflake, reason?: string) {
        this.cache.delete(id);
        return this.client.rest.delete<void>(`/channels/${id}`, { reason: reason as string });
    }

    public async edit(id: Snowflake, data: EditChannelData, reason?: string): Promise<AnyChannel> {
        const channel = await this.client.rest.patch<APIChannel>(`/channels/${id}`, {
            body: await ChannelDataResolver(data),
            reason: reason as string,
        });

        let _channel = this.cache.get(id)!;

        if (_channel) {
            _channel = _channel._patch(channel as any);
        }

        return this.cache.setAndReturnValue(channel.id, _channel ?? this._createChannel(channel));
    }

    public async fetch(
        id: Snowflake,
        { force }: FetchOptions = { force: false },
    ): Promise<AnyChannel> {
        let _channel = this.cache.get(id)!;

        if (!force && _channel) {
            return _channel;
        } else {
            const channel = await this.client.rest.get<APIChannel>(`/channels/${id}`);

            if (_channel) {
                _channel = _channel._patch(channel as any);
            }

            return this.cache.setAndReturnValue(
                channel.id,
                _channel ?? this._createChannel(channel),
            );
        }
    }

    public async fetchMessages(
        channelId: Snowflake,
        messageId?: Snowflake,
    ): Promise<Collectionable<Snowflake, Message>> {
        if (messageId) {
            const message = await this.client.rest.get<APIMessage>(
                `/channels/${channelId}/messages/${messageId}`,
            );

            const _channel = this.cache.get(channelId)!;

            if (_channel) {
                (_channel as any).caches.messages.cache.set(
                    message.id,
                    new Message(this.client, message),
                );
            }

            return new Message(this.client, message);
        } else {
            const messages = await this.client.rest.get<APIMessage[]>(
                `/channels/${channelId}/messages`,
            );

            const result = new Collection<Snowflake, Message>();

            const _channel = this.cache.get(channelId)!;

            for (const message of messages) {
                if (_channel) {
                    let _message = (
                        _channel as MessageableChannelResolvable
                    ).caches.messages.cache.get(message.id);

                    if (_message) {
                        _message = _message._patch(message);
                    }

                    result.set(message.id, _message ?? new Message(this.client, message));
                } else {
                    result.set(message.id, new Message(this.client, message));
                }
            }

            if (_channel) {
                (_channel as MessageableChannelResolvable).caches.messages.cache.clear();
                (_channel as MessageableChannelResolvable).caches.messages.cache.concat(result);
            }

            return result;
        }
    }

    public deleteMessage(channelId: Snowflake, messageId: Snowflake, reason?: string) {
        const _channel = this.cache.get(channelId)!;

        if (_channel) {
            (_channel as any).caches.messages.cache.delete(messageId);
        }

        return this.client.rest.delete<void>(`/channels/${channelId}/messages/${messageId}`, {
            reason: reason,
        });
    }

    public async editMessage(
        channelId: Snowflake,
        messageId: Snowflake,
        data: EditMessageData,
    ): Promise<Message> {
        const { body, files } = await MessageDataResolver(data);

        body.failIfNotExists &&= this.client.options.failIfNotExists;

        const message = await this.client.rest.patch<APIMessage>(
            `/channels/${channelId}/messages/${messageId}`,
            {
                body,
                files,
            },
        );

        const _channel = this.cache.get(channelId)!;

        if (_channel) {
            let _message = (_channel as any).caches.messages.cache.get(messageId);

            if (_message) {
                _message = _message._patch(message);
            } else {
                _message = new Message(this.client, message);
            }

            return _message;
        } else {
            return new Message(this.client, message);
        }
    }

    public async createMessage(channelId: Snowflake, data: CreateMessageData | string) {
        const { body, files } = await MessageDataResolver(data);

        body.failIfNotExists &&= this.client.options.failIfNotExists;

        const message = await this.client.rest.post<APIMessage>(`/channels/${channelId}/messages`, {
            body,
            files,
        });

        const _message = new Message(this.client, message);

        const _channel = this.cache.get(channelId)!;

        if (_channel) {
            (_channel as any).caches?.messages?.cache.set(message.id, _message);
        }

        return _message;
    }

    public async crosspostMessage(channelId: Snowflake, messageId: Snowflake) {
        const message = await this.client.rest.post<APIMessage>(
            `/channels/${channelId}/messages/${messageId}/crosspost`,
        );

        const _channel = this.cache.get(channelId)!;
        const _message = new Message(this.client, message);

        if (_channel) {
            (_channel as any).caches.messages.cache.set(message.id, _message);
        }

        return _message;
    }

    public triggerTyping(id: Snowflake) {
        return this.client.rest.post<void>(`/channels/${id}/typing`);
    }

    public async fetchPins(id: Snowflake) {
        const pins = await this.client.rest.get<APIMessage[]>(`/channels/${id}/pins`);

        const _channel = this.cache.get(id)! as TextBasedChannelResolvable;
        const result = new Collection<Snowflake, Message>(
            pins.map((message) => [message.id, new Message(this.client, message)]),
        );

        if (_channel) {
            (_channel.caches as TextBasedChannelCacheManager).pins.cache.clear();
            (_channel.caches as TextBasedChannelCacheManager).pins.cache.concat(result);
        }

        return result;
    }

    public pinMessage(channelId: Snowflake, messageId: Snowflake, reason?: string) {
        return this.client.rest.put<void>(`/channels/${channelId}/pins/${messageId}`, {
            reason: reason,
        });
    }

    public unpinMessage(channelId: Snowflake, messageId: Snowflake, reason?: string) {
        return this.client.rest.delete<void>(`/channels/${channelId}/pins/${messageId}`, {
            reason: reason,
        });
    }

    public async fetchWebhooks(
        channelId?: Snowflake,
        webhookId?: Snowflake,
        options?: FetchOptions,
    ) {
        if (webhookId) {
            return await this.client.caches.webhooks.fetch(webhookId, options);
        } else {
            const webhooks = await this.client.rest.get<APIWebhook[]>(
                `/channels/${channelId}/webhooks`,
            );
            return new Collection<Snowflake, Webhook>(
                webhooks.map((webhook) => [webhook.id, new Webhook(this.client, webhook)]),
            );
        }
    }
}
