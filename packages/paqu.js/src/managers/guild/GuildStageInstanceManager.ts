import type {
    Client,
    Snowflake,
    FetchOptions,
    EditStageInstanceData,
    CreateStageInstanceData,
    StageInstance,
    Guild,
} from '../../index';

import { CachedManager } from '../base/CachedManager';

export class GuildStageInstanceManager extends CachedManager<Snowflake, StageInstance> {
    public guild: Guild;

    public constructor(client: Client, guild: Guild) {
        super(client);

        this.guild = guild;
    }

    public async fetch(id: Snowflake, options?: FetchOptions) {
        const stageInstance = await this.client.caches.stageInstances.fetch(id, options);

        return this.cache.setAndReturnValue(stageInstance.id, stageInstance);
    }

    public async create(data: CreateStageInstanceData, reason?: string) {
        const stageInstance = await this.client.caches.stageInstances.create(data, reason);

        return this.cache.setAndReturnValue(stageInstance.id, stageInstance);
    }

    public delete(id: Snowflake, reason?: string) {
        this.cache.delete(id);
        return this.client.caches.stageInstances.delete(id, reason);
    }

    public async edit(id: Snowflake, data: EditStageInstanceData, reason?: string) {
        const stageInstance = await this.client.caches.stageInstances.edit(id, data, reason);

        return this.cache.setAndReturnValue(stageInstance.id, stageInstance);
    }
}
