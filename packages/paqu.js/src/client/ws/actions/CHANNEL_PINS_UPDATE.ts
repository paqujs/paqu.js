import type {
    DMBasedChannelResolvable,
    GatewayChannelPinsUpdateDispatch,
    GuildTextBasedNonThreadChannelResolvable,
} from '../../../index';
import { BaseAction } from './BaseAction';

export class CHANNEL_PINS_UPDATE extends BaseAction {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayChannelPinsUpdateDispatch) {
        const guild = this.handler.client.caches.guilds.cache.get(d.guild_id);

        if (guild) {
            const channel = guild.caches.channels.cache.get(
                d.channel_id,
            ) as GuildTextBasedNonThreadChannelResolvable;

            if (d.last_pin_timestamp) {
                channel.lastPinTimestamp = new Date(d.last_pin_timestamp).getTime();

                if (channel) {
                    this.handler.emit('channelPinsUpdate', channel, {
                        lastPinTimestamp: channel.lastPinTimestamp,
                        lastPinAt: channel.lastPinTimestamp
                            ? new Date(channel.lastPinTimestamp)
                            : null,
                    });
                }
            }
        } else {
            const channel = this.handler.client.caches.channels.cache.get(
                d.channel_id,
            ) as DMBasedChannelResolvable;

            if (d.last_pin_timestamp) {
                channel.lastPinTimestamp = new Date(d.last_pin_timestamp).getTime();

                if (channel) {
                    this.handler.emit('channelPinsUpdate', channel, {
                        lastPinTimestamp: channel.lastPinTimestamp,
                        lastPinAt: channel.lastPinTimestamp
                            ? new Date(channel.lastPinTimestamp)
                            : null,
                    });
                }
            }
        }
    }
}
