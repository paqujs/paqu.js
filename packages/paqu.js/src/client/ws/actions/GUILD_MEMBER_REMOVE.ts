import type { GatewayGuildMemberRemoveDispatch } from '../../../index';
import { BaseAction } from './BaseAction';

export class GUILD_MEMBER_REMOVE extends BaseAction {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayGuildMemberRemoveDispatch) {
        const guild = this.handler.client.caches.guilds.cache.get(d.guild_id);

        if (guild) {
            const member = guild.caches.members.cache.get(d.user.id);

            if (member) {
                guild.caches.members.cache.delete(member.id);
                this.handler.emit('guildMemberRemove', member);
            }
        }
    }
}
