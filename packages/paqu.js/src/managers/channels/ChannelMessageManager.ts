import type {
    Message,
    Snowflake,
    Client,
    MessageableChannelResolvable,
    CreateMessageData,
    FetchOptions,
    EditMessageData,
} from '../../index';

import { CachedManager } from '../base/CachedManager';

export class ChannelMessageManager extends CachedManager<Snowflake, Message> {
    public channel: MessageableChannelResolvable;

    public constructor(client: Client, channel: MessageableChannelResolvable) {
        super(client);

        this.channel = channel;
    }

    public async create(data: CreateMessageData | string) {
        const message = await this.client.caches.channels.createMessage(this.channel.id, data);

        return this.channel.caches.messages.cache.setAndReturnValue(message.id, message);
    }

    public async fetch(id?: Snowflake, { force }: FetchOptions = { force: false }) {
        if (id) {
            const _message = this.channel.caches.messages.cache.get(id);

            if (!force && _message) {
                return _message;
            }
        }

        return await this.client.caches.channels.fetchMessages(this.channel.id, id);
    }

    public async edit(id: Snowflake, data: EditMessageData) {
        return await this.client.caches.channels.editMessage(this.channel.id, id, data);
    }

    public async delete(id: Snowflake, reason?: string) {
        return await this.client.caches.channels.deleteMessage(this.channel.id, id, reason);
    }

    public async crosspost(id: Snowflake) {
        return await this.client.caches.channels.crosspostMessage(this.channel.id, id);
    }

    public async pin(id: Snowflake, reason?: string) {
        return await this.client.caches.channels.pinMessage(this.channel.id, id, reason);
    }

    public async unpin(id: Snowflake, reason?: string) {
        return await this.client.caches.channels.unpinMessage(this.channel.id, id, reason);
    }

    public async fetchPins() {
        return await this.client.caches.channels.fetchPins(this.channel.id);
    }
}
