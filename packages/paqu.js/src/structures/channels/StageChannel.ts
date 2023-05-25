import type {
    APIGuildStageVoiceChannel,
    Guild,
    Client,
    EditChannelData,
    FetchOptions,
    EditStageInstanceData,
} from '../../index';

import { BaseVoiceChannel } from '../base/BaseVoiceChannel';

export class StageChannel extends BaseVoiceChannel {
    public constructor(client: Client, guild: Guild, data: APIGuildStageVoiceChannel) {
        super(client, guild, data);

        this._patch(data);
    }

    public override _patch(data: APIGuildStageVoiceChannel) {
        super._patch(data);

        return this;
    }

    public override async fetch(options?: FetchOptions) {
        return (await super.fetch(options)) as unknown as StageChannel;
    }

    public override async edit(data: EditChannelData, reason?: string) {
        return (await super.edit(data, reason)) as unknown as StageChannel;
    }

    public async fetchStageInstance(options?: FetchOptions) {
        return await this.client.caches.stageInstances.fetch(this.id, options);
    }

    public async editStageInstance(data: EditStageInstanceData, reason?: string) {
        return await this.client.caches.stageInstances.edit(this.id, data, reason);
    }

    public async deleteStageInstance(reason?: string) {
        return await this.client.caches.stageInstances.delete(this.id, reason);
    }
}
