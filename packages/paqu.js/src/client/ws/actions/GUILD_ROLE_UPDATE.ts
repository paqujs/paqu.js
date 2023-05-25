import type { GatewayGuildRoleUpdateDispatch } from '../../../index';
import { BaseAction } from './BaseAction';

export class GUILD_ROLE_UPDATE extends BaseAction {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayGuildRoleUpdateDispatch) {
        const guild = this.handler.client.caches.guilds.cache.get(d.guild_id);

        if (guild) {
            let _role = guild.caches.roles.cache.get(d.role.id);

            if (_role) {
                const role = _role;

                _role = _role._patch(d.role);

                guild.caches.roles.cache.set(role.id, _role);
                this.handler.emit('roleUpdate', role, _role);
            }
        }
    }
}
