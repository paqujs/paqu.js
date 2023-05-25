import { type GatewayGuildBanAddDispatch, User, GuildBan } from '../../../index';
import { BaseAction } from './BaseAction';

export class GUILD_BAN_ADD extends BaseAction {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayGuildBanAddDispatch) {
        const guild = this.handler.client.caches.guilds.cache.get(d.guild_id);
        let user = this.handler.client.caches.users.cache.get(d.user.id);

        if (user) {
            user = user._patch(d.user);
        } else {
            user = new User(this.handler.client, d.user);
        }

        this.handler.client.caches.users.cache.set(d.user.id, user);

        if (guild) {
            this.handler.emit(
                'guildBanAdd',
                guild.caches.bans.cache.setAndReturnValue(
                    d.user.id,
                    new GuildBan(this.handler.client, guild, d),
                ),
            );
        }
    }
}
