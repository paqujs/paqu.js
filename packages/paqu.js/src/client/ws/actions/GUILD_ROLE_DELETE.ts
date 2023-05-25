import type { GatewayGuildRoleDeleteDispatch } from '../../../index';
import { BaseAction } from './BaseAction';

export class GUILD_ROLE_DELETE extends BaseAction {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayGuildRoleDeleteDispatch) {
        const guild = this.handler.client.caches.guilds.cache.get(d.guild_id);

        if (guild) {
            const role = guild.caches.roles.cache.get(d.role_id);

            if (role) {
                guild.caches.roles.cache.delete(role.id);
                this.handler.emit('roleDelete', role);
            }
        }
    }
}
