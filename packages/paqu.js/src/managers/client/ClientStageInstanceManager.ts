import {
    type Client,
    type Snowflake,
    type FetchOptions,
    type EditStageInstanceData,
    type CreateStageInstanceData,
    type APIStageInstance,
    StageInstance,
} from '../../index';
import { StageInstancePrivacyLevel } from 'discord-api-types/v10';
import { Collection } from '@paqujs/shared';
import { BaseManager } from '../base/BaseManager';

export class ClientStageInstanceManager extends BaseManager {
    public constructor(client: Client) {
        super(client);
    }

    public get cache() {
        return new Collection<Snowflake, StageInstance>(
            this.client.caches.guilds.cache.reduce((accumulator: any, guild) => {
                accumulator.push(
                    ...guild.caches.stageInstances.cache.map((stageInstance) => [
                        stageInstance.id,
                        stageInstance,
                    ]),
                );

                return accumulator;
            }, []),
        );
    }

    public async fetch(
        id: Snowflake,
        { force }: FetchOptions = { force: false },
    ): Promise<StageInstance> {
        let _stageInstance = this.cache.get(id)!;

        if (!force && _stageInstance) {
            return _stageInstance;
        } else {
            const stageInstance = await this.client.rest.get<APIStageInstance>(
                `/stage-instances/${id}`,
            );

            if (_stageInstance) {
                _stageInstance = _stageInstance._patch(stageInstance);
            }

            return this.cache.setAndReturnValue(
                stageInstance.id,
                _stageInstance ?? new StageInstance(this.client, stageInstance),
            );
        }
    }

    public async create(data: CreateStageInstanceData, reason?: string): Promise<StageInstance> {
        if (typeof data.privacy_level === 'string') {
            data.privacy_level = StageInstancePrivacyLevel[data.privacy_level];
        }

        const stageInstance = await this.client.rest.post<APIStageInstance>('/stage-instances', {
            body: data,
            reason: reason as string,
        });

        return this.cache.setAndReturnValue(
            stageInstance.id,
            new StageInstance(this.client, stageInstance),
        );
    }

    public async delete(id: Snowflake, reason?: string) {
        this.cache.delete(id);
        return await this.client.rest.delete<void>(`/stage-instances/${id}`, {
            reason: reason as string,
        });
    }

    public async edit(
        id: Snowflake,
        data: EditStageInstanceData,
        reason?: string,
    ): Promise<StageInstance> {
        if (typeof data.privacy_level === 'string') {
            data.privacy_level = StageInstancePrivacyLevel[data.privacy_level];
        }

        const stageInstance = await this.client.rest.patch<APIStageInstance>(
            `/stage-instances/${id}`,
            {
                body: data,
                reason: reason as string,
            },
        );

        let _stageInstance = this.cache.get(id)!;

        if (_stageInstance) {
            _stageInstance = _stageInstance._patch(stageInstance);
        }

        return this.cache.setAndReturnValue(
            stageInstance.id,
            _stageInstance ?? new StageInstance(this.client, stageInstance),
        );
    }
}
