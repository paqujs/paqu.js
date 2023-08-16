import type { Client, Snowflake, Guild, Role, GuildMember } from '../../index';
import { PermissionFlagsBitField } from '@paqujs/bitfields';

import { CachedManager } from '../base/CachedManager';

export class GuildMemberRoleManager extends CachedManager<Snowflake, Role> {
    public guild: Guild;
    public member: GuildMember;

    public constructor(client: Client, guild: Guild, member: GuildMember) {
        super(client);

        this.guild = guild;
        this.member = member;

        for (const roleId of member.rawRoles) {
            const role = guild.caches.roles.cache.get(roleId);
            role && this.cache.set(roleId, role);
        }
    }

    public get highest() {
        return this.cache
            .sorted((a, b) =>
                b.rawPosition === a.rawPosition
                    ? Number(BigInt(a.id) - BigInt(b.id))
                    : b.rawPosition - a.rawPosition,
            )
            .first();
    }

    public get permissions() {
        return new PermissionFlagsBitField(
            (this.cache as any).reduce(
                (accumulator, role) => accumulator | role.permissions.bitset,
                0,
            ),
        );
    }

    public set(roles: Snowflake[], reason?: string) {
        this.cache.clear();

        for (const id of roles) {
            const _role = this.guild.caches.roles.cache.get(id);

            if (_role) {
                this.cache.set(id, _role);
            }
        }

        return this.member.edit({ roles }, reason);
    }

    public add(id: Snowflake, reason?: string) {
        const role = this.guild.caches.roles.cache.get(id);

        if (role) {
            this.cache.set(id, role);
        }

        return this.guild.caches.members.addRole(this.member.id, id, reason);
    }

    public remove(id: Snowflake, reason?: string) {
        this.cache.delete(id);
        return this.guild.caches.members.removeRole(this.member.id, id, reason);
    }
}
