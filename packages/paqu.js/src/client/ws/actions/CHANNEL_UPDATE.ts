import type { GatewayChannelUpdateDispatch, Guild } from '../../../index';
import { BaseAction } from './BaseAction';

export class CHANNEL_UPDATE extends BaseAction {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayChannelUpdateDispatch) {
        let guild: Guild;

        if ('guild_id' in d) {
            guild = this.handler.client.caches.guilds.cache.get(d.guild_id);
        }

        const channel = this.handler.client.caches.channels.cache.get(d.id);

        if (channel) {
            const _channel = this.updateChannelInEveryting(channel, d, guild);

            this.handler.emit('channelUpdate', channel, _channel);
        }
    }
}
