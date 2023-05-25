import type { MessageableChannelResolvable, GatewayMessageUpdateDispatch } from '../../../index';
import { BaseAction } from './BaseAction';

export class MESSAGE_UPDATE extends BaseAction {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayMessageUpdateDispatch) {
        const guild = this.handler.client.caches.guilds.cache.get(d.guild_id);
        const channel = this.handler.client.caches.channels.cache.get(
            d.channel_id,
        ) as MessageableChannelResolvable;

        if (channel) {
            let _message = channel.caches.messages.cache.get(d.id);

            if (_message) {
                const message = _message;

                _message = _message._patch(d);

                channel.caches.messages.cache.set(d.id, _message);

                if (guild) {
                    const guildChannel = guild.caches.channels.cache.get(
                        d.channel_id,
                    ) as MessageableChannelResolvable;
                    if (guildChannel) {
                        guildChannel.caches.messages.cache.set(d.id, _message);
                    }
                }

                this.handler.emit('messageUpdate', message, _message);
            }
        }
    }
}
