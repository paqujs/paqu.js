import type { Snowflake, GuildIntegration, Client, Guild } from '../../index';

import { CachedManager } from '../base/CachedManager';

export class GuildIntegrationManager extends CachedManager<Snowflake, GuildIntegration> {
    public guild!: Guild;

    public constructor(client: Client, guild: Guild) {
        super(client);

        this.guild = guild;
    }

    public async fetch() {
        const integrations = await this.client.caches.guilds.fetchIntegrations(this.guild.id);

        this.cache.clear();
        this.cache.concat(integrations);

        return this.cache;
    }

    public async delete(id: Snowflake, reason?: string) {
        this.cache.delete(id);
        return await this.client.caches.guilds.deleteIntegration(this.guild.id, id, reason);
    }
}
