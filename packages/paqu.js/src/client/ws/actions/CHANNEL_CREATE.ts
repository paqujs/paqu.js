import type { GatewayChannelCreateDispatch, Guild } from '../../../index';
import { BaseAction } from './BaseAction';

export class CHANNEL_CREATE extends BaseAction {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayChannelCreateDispatch) {
        let guild: Guild;

        if ('guild_id' in d) {
            guild = this.handler.client.caches.guilds.cache.get(d.guild_id);
        }

        const channel = this.handler.client.caches.channels._createChannel(d, guild);

        this.addChannelToEveryting(channel, guild);
        this.handler.emit('channelCreate', channel);
    }
}
