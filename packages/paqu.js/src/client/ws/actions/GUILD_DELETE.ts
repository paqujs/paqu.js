import type { GatewayGuildDeleteDispatch } from '../../../index';
import { BaseAction } from './BaseAction';

export class GUILD_DELETE extends BaseAction {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayGuildDeleteDispatch) {
        const guild = this.handler.client.caches.guilds.cache.get(d.id);

        this.handler.client.caches.guilds.unavailables.delete(d.id);

        if (guild) {
            this.handler.client.caches.guilds.delete(d.id);
            this.handler.emit('guildDelete', guild!);
        }
    }
}
