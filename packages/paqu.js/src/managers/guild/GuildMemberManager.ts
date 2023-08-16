import {
    type Client,
    type Snowflake,
    type Guild,
    type Collectionable,
    type APIGuildMember,
    type FetchMemberOptions,
    type EditGuildMemberData,
    type RESTPutAPIGuildMemberJSONBody,
    GuildMember,
} from '../../index';
import { Collection } from '@paqujs/shared';
import { CachedManager } from '../base/CachedManager';

export class GuildMemberManager extends CachedManager<Snowflake, GuildMember> {
    public guild: Guild;

    public constructor(client: Client, guild: Guild) {
        super(client);

        this.guild = guild;
    }

    public async fetch(
        id?: Snowflake | null,
        { force, limit, after }: FetchMemberOptions = {
            force: false,
            limit: 1,
            after: 0 as unknown as string,
        },
    ): Promise<Collectionable<Snowflake, GuildMember>> {
        if (id) {
            let _member = this.cache.get(id)!;

            if (!force && _member) {
                return _member;
            } else {
                const member = await this.client.rest.get<APIGuildMember>(
                    `/guilds/${this.guild.id}/members/${id}`,
                );

                if (_member) {
                    _member = _member._patch(member);
                }

                return this.cache.setAndReturnValue(
                    member.user?.id!,
                    _member ?? new GuildMember(this.client, this.guild, member),
                );
            }
        } else {
            const members = await this.client.rest.get<APIGuildMember[]>(
                `/guilds/${this.guild.id}/members`,
                { query: { limit, after } },
            );

            const result = new Collection<Snowflake, GuildMember>();

            for (const member of members) {
                let _member = this.cache.get(member.user?.id!)!;

                if (_member) {
                    _member = _member._patch(member);
                }

                result.set(
                    member.user?.id!,
                    _member ?? new GuildMember(this.client, this.guild, member),
                );
            }

            this.cache.clear();
            this.cache.concat(result);

            return this.cache;
        }
    }

    public async create(data: RESTPutAPIGuildMemberJSONBody, reason?: string) {
        const member = await this.client.rest.put<APIGuildMember>(
            `/guilds/${this.guild.id}/members`,
            {
                body: data,
                reason: reason as string,
            },
        );

        return this.cache.setAndReturnValue(
            member.user?.id!,
            new GuildMember(this.client, this.guild, member),
        );
    }

    public kick(id: Snowflake, reason?: string) {
        this.cache.delete(id);
        return this.client.rest.delete<void>(`/guilds/${this.guild.id}/members/${id}`, {
            reason: reason as string,
        });
    }

    public async edit(id: Snowflake, data: EditGuildMemberData, reason?: string) {
        if (data.communication_disabled_until) {
            data.communication_disabled_until = new Date(
                Date.now() + data.communication_disabled_until,
            ).toISOString() as unknown as number;
        }

        const member = await this.client.rest.patch<APIGuildMember>(
            `/guilds/${this.guild.id}/members/${id}`,
            {
                body: data,
                reason: reason as string,
            },
        );

        let _member = this.cache.get(id)!;

        if (_member) {
            _member = _member._patch(member);
        }

        return this.cache.setAndReturnValue(
            member.user?.id!,
            _member ?? new GuildMember(this.client, this.guild, member),
        );
    }

    public addRole(memberId: Snowflake, roleId: Snowflake, reason?: string) {
        return this.client.rest.put<void>(`/guilds/${this.guild.id}/members/${memberId}/roles/${roleId}`, {
            reason: reason as string,
        });
    }

    public removeRole(memberId: Snowflake, roleId: Snowflake, reason?: string) {
        return this.client.rest.delete<void>(
            `/guilds/${this.guild.id}/members/${memberId}/roles/${roleId}`,
            {
                reason: reason as string,
            },
        );
    }
}
