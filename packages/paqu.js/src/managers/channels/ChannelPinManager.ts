import type { Snowflake, Client, PinnableChannelResolvable, Message } from '../../index';

import { CachedManager } from '../base/CachedManager';

export class ChannelPinManager extends CachedManager<Snowflake, Message> {
    public channel: PinnableChannelResolvable;

    public constructor(client: Client, channel: PinnableChannelResolvable) {
        super(client);

        this.channel = channel;
    }

    public create(id: Snowflake, reason?: string) {
        return this.channel.caches.messages.pin(id, reason);
    }

    public delete(id: Snowflake, reason?: string) {
        return this.channel.caches.messages.unpin(id, reason);
    }

    public fetch() {
        return this.channel.caches.messages.fetchPins();
    }
}
