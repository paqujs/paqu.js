import type { Client, RESTPostAPIChannelFollowersResult, Snowflake } from './../../index';

import { BaseStructure } from '../base/BaseStructure';

export class FollowedChannel extends BaseStructure {
    public channelId!: Snowflake;
    public webhookId!: Snowflake;

    public constructor(client: Client, data: RESTPostAPIChannelFollowersResult) {
        super(client);

        this._patch(data);
    }

    public override _patch(data: RESTPostAPIChannelFollowersResult) {
        this.channelId = data.channel_id;
        this.webhookId = data.webhook_id;
        return this;
    }

    public get channel() {
        return this.client.caches.channels.cache.get(this.channelId);
    }

    public get webhook() {
        return this.client.caches.webhooks.cache.get(this.webhookId);
    }
}
