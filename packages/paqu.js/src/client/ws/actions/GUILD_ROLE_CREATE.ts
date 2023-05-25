import { type GatewayGuildRoleCreateDispatch, Role } from '../../../index';
import { BaseAction } from './BaseAction';

export class GUILD_ROLE_CREATE extends BaseAction {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayGuildRoleCreateDispatch) {
        const guild = this.handler.client.caches.guilds.cache.get(d.guild_id);

        if (guild) {
            const role = new Role(this.handler.client, guild, d.role);

            guild.caches.roles.cache.set(role.id, role);
            this.handler.emit('roleCreate', role);
        }
    }
}
