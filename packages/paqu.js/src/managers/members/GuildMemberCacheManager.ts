import { GuildMemberRoleManager, type Client, type Guild, type GuildMember } from '../../index';

import { BaseManager } from '../base/BaseManager';

export class GuildMemberCacheManager extends BaseManager {
    public guild: Guild;
    public member: GuildMember;
    public roles: GuildMemberRoleManager;

    public constructor(client: Client, guild: Guild, member: GuildMember) {
        super(client);

        this.guild = guild;
        this.member = member;
        this.roles = new GuildMemberRoleManager(client, guild, member);
    }
}
