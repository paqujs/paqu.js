import type { GatewayMessageDeleteDispatch, GuildTextBasedChannelResolvable } from '../../../index';
import { BaseAction } from './BaseAction';

export class MESSAGE_DELETE extends BaseAction {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayMessageDeleteDispatch) {
        if (d.guild_id) {
            const guild = this.handler.client.caches.guilds.cache.get(d.guild_id);

            if (guild) {
                const channel = guild.caches.channels.cache.get(
                    d.channel_id,
                ) as GuildTextBasedChannelResolvable;
                const clientChannel = this.handler.client.caches.channels.cache.get(
                    d.channel_id,
                ) as GuildTextBasedChannelResolvable;

                if (channel) {
                    const message = channel.caches.messages.cache.get(d.id);

                    if (message) {
                        channel.caches.messages.cache.delete(d.id);
                        clientChannel.caches.messages.cache.delete(d.id);
                        this.handler.emit('messageDelete', message);
                    }
                }
            }
        } else {
            const channel = this.handler.client.caches.channels.cache.get(
                d.channel_id,
            ) as GuildTextBasedChannelResolvable;

            if (channel) {
                const message = channel.caches.messages.cache.get(d.id);

                if (message) {
                    channel.caches.messages.cache.delete(d.id);
                    this.handler.emit('messageDelete', message);
                }
            }
        }
    }
}
