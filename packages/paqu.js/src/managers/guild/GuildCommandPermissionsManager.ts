import type { Snowflake, Client, Guild, ApplicationCommandPermissionsChildData } from '../../index';
import { BaseManager } from '../base/BaseManager';

export class GuildCommandPermissionsManager extends BaseManager {
    public guild: Guild;

    public constructor(client: Client, guild: Guild) {
        super(client);

        this.guild = guild;
    }

    public fetch(id?: Snowflake) {
        return this.client.caches.guilds.fetchCommandPermissions(this.guild.id, id);
    }

    public set(
        id: Snowflake,
        token: string,
        permissions: ApplicationCommandPermissionsChildData[],
    ) {
        return this.client.caches.guilds.setCommandPermissions(
            this.guild.id,
            id,
            token,
            permissions,
        );
    }
}
