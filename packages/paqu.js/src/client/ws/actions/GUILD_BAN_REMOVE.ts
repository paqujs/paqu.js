import { type GatewayGuildBanRemoveDispatch, User } from '../../../index';
import { BaseAction } from './BaseAction';

export class GUILD_BAN_REMOVE extends BaseAction {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayGuildBanRemoveDispatch) {
        const guild = this.handler.client.caches.guilds.cache.get(d.guild_id);
        let user = this.handler.client.caches.users.cache.get(d.user.id);

        if (user) {
            user = user._patch(d.user);
        } else {
            user = new User(this.handler.client, d.user);
        }

        if (guild) {
            const ban = guild.caches.bans.cache.get(d.user.id);

            if (ban) {
                guild.caches.bans.cache.delete(d.user.id);
                this.handler.emit('guildBanRemove', ban);
            }
        }
    }
}
