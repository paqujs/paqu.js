import {
    type GatewayGuildCreateDispatch,
    type APIUnavailableGuild,
    Guild,
    UnavailableGuild,
} from '../../../index';
import { BaseAction } from './BaseAction';

export class GUILD_CREATE extends BaseAction {
    public constructor() {
        super();
    }

    public override handle({ d, shard_id }: GatewayGuildCreateDispatch & { shard_id: number }) {
        if (d.unavailable) {
            this.handler.client.caches.guilds.unavailables.set(
                d.id,
                new UnavailableGuild(this.handler.client, d as APIUnavailableGuild),
            );
        } else {
            (d as any).shard_id = shard_id;

            const guild = new Guild(this.handler.client, d);

            this.handler.client.caches.guilds.cache.set(d.id, guild);
            this.handler.emit('guildCreate', guild);
        }
    }
}
