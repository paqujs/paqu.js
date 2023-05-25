import type { GatewayGuildUpdateDispatch } from '../../../index';
import { BaseAction } from './BaseAction';

export class GUILD_UPDATE extends BaseAction {
    public constructor() {
        super();
    }

    public override handle({ d, shard_id }: GatewayGuildUpdateDispatch & { shard_id: number }) {
        let _guild = this.handler.client.caches.guilds.cache.get(d.id);

        (d as any).shard_id = shard_id;

        if (_guild) {
            const guild = _guild;

            _guild = _guild._patch(d);

            this.handler.client.caches.guilds.cache.set(guild.id, _guild);
            this.handler.emit('guildUpdate', guild, _guild);
        }
    }
}
