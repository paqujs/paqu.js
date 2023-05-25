import {
    type Client,
    type Snowflake,
    type Guild,
    type APIRole,
    type EditAndCreateRoleData,
    type FetchOptions,
    type Collectionable,
    Role,
} from '../../index';
import { RoleDataResolver } from '@paqujs/resolvers';
import { Collection } from '@paqujs/shared';
import { CachedManager } from '../base/CachedManager';

export class GuildRoleManager extends CachedManager<Snowflake, Role> {
    public guild: Guild;

    public constructor(client: Client, guild: Guild) {
        super(client);

        this.guild = guild;
    }

    public async fetch(
        id?: Snowflake,
        { force }: FetchOptions = { force: false },
    ): Promise<Collectionable<Snowflake, Role>> {
        if (id) {
            const _role = this.cache.get(id)!;

            if (!force && _role) {
                return _role;
            }

            const roles = (await this.fetch(undefined, {
                force: force as boolean,
            })) as Collection<Snowflake, Role>;

            return roles.get(id)!;
        } else {
            const roles = await this.client.rest.get<APIRole[]>(`/guilds/${this.guild.id}/roles`);

            const result = new Collection<Snowflake, Role>();

            for (const role of roles) {
                let _role = this.cache.get(role.id!)!;

                if (_role) {
                    _role = _role._patch(role);
                }

                result.set(role.id, _role ?? new Role(this.client, this.guild, role));
            }

            this.cache.clear();
            this.cache.concat(result);

            return this.cache;
        }
    }

    public async create(data: EditAndCreateRoleData, reason?: string) {
        const role = await this.client.rest.post<APIRole>(`/guilds/${this.guild.id}/roles`, {
            body: RoleDataResolver(data),
            reason: reason as string,
        });

        return this.cache.setAndReturnValue(role.id, new Role(this.client, this.guild, role));
    }

    public async delete(id: Snowflake, reason?: string) {
        await this.client.rest.delete(`/guilds/${this.guild.id}/roles/${id}`, {
            reason: reason as string,
        });

        this.cache.delete(id);
    }

    public async edit(id: Snowflake, data: EditAndCreateRoleData, reason?: string) {
        const role = await this.client.rest.patch<APIRole>(`/guilds/${this.guild.id}/roles/${id}`, {
            body: RoleDataResolver(data),
            reason: reason as string,
        });

        let _role = this.cache.get(id)!;

        if (_role) {
            _role = _role._patch(role);
        }

        return this.cache.setAndReturnValue(
            role.id,
            _role ?? new Role(this.client, this.guild, role),
        );
    }

    public async setPosition(id: Snowflake, position: number, reason?: string) {
        const role = await this.client.rest.patch<APIRole>(`/guilds/${this.guild.id}/roles`, {
            body: { id, position, reason: reason },
        });

        let _role = this.cache.get(id);

        if (_role) {
            _role = _role._patch(role);
        }

        return this.cache.setAndReturnValue(
            role.id,
            _role ?? new Role(this.client, this.guild, role),
        );
    }
}
