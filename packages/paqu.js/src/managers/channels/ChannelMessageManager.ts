import type {
    Message,
    Snowflake,
    Client,
    MessageableChannelResolvable,
    CreateMessageData,
    FetchMessageOptions,
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

    public fetch(id?: Snowflake, options: FetchMessageOptions = { force: false }) {
        if (id) {
            const _message = this.channel.caches.messages.cache.get(id);

            if (!options.force && _message) {
                return _message;
            }
        }

        return this.client.caches.channels.fetchMessages(this.channel.id, id, options);
    }

    public edit(id: Snowflake, data: EditMessageData) {
        return this.client.caches.channels.editMessage(this.channel.id, id, data);
    }

    public delete(id: Snowflake, reason?: string) {
        return this.client.caches.channels.deleteMessage(this.channel.id, id, reason);
    }

    public crosspost(id: Snowflake) {
        return this.client.caches.channels.crosspostMessage(this.channel.id, id);
    }

    public pin(id: Snowflake, reason?: string) {
        return this.client.caches.channels.pinMessage(this.channel.id, id, reason);
    }

    public unpin(id: Snowflake, reason?: string) {
        return this.client.caches.channels.unpinMessage(this.channel.id, id, reason);
    }

    public fetchPins() {
        return this.client.caches.channels.fetchPins(this.channel.id);
    }
}
