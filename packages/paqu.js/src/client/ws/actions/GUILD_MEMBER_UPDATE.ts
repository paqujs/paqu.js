import type { GatewayGuildMemberUpdateDispatch, APIGuildMember } from '../../../index';
import { BaseAction } from './BaseAction';

export class GUILD_MEMBER_UPDATE extends BaseAction {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayGuildMemberUpdateDispatch) {
        const guild = this.handler.client.caches.guilds.cache.get(d.guild_id);

        if (guild) {
            let _member = guild.caches.members.cache.get(d.user.id);

            if (_member) {
                const member = _member;

                _member = _member._patch(d as APIGuildMember);

                guild.caches.members.cache.set(member.id, _member);
                this.handler.emit('guildMemberUpdate', member, _member);
            }
        }
    }
}
