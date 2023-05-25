import { type GatewayGuildMemberAddDispatch, GuildMember } from '../../../index';
import { BaseAction } from './BaseAction';

export class GUILD_MEMBER_ADD extends BaseAction {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayGuildMemberAddDispatch) {
        const guild = this.handler.client.caches.guilds.cache.get(d.guild_id);

        if (guild) {
            const member = new GuildMember(this.handler.client, guild, d);

            guild.caches.members.cache.set(member.id, member);
            this.handler.emit('guildMemberAdd', member);
        }
    }
}
