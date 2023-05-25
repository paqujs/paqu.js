import type { GatewayChannelCreateDispatch, Guild } from '../../../index';
import { BaseAction } from './BaseAction';

export class CHANNEL_DELETE extends BaseAction {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayChannelCreateDispatch) {
        let guild: Guild;

        if ('guild_id' in d) {
            guild = this.handler.client.caches.guilds.cache.get(d.guild_id);
        }

        const channel = this.handler.client.caches.channels.cache.get(d.id);

        if (channel) {
            this.handler.client.caches.channels.cache.delete(d.id);

            this.removeChannelFromEveryting(d.id, guild);
            this.handler.emit('channelDelete', channel);
        }
    }
}
