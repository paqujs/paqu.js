import {
    type Client,
    type Snowflake,
    type InteractionWebhookData,
    type CreateWebhookMessageOptions,
    type CreateWebhookMessageData,
    InteractionWebhookCacheManager,
} from '../../index';

import { BaseStructure } from '../base/BaseStructure';

export class InteractionWebhook extends BaseStructure {
    public id!: Snowflake;
    public token!: string;
    public caches!: InteractionWebhookCacheManager;

    public constructor(client: Client, data: InteractionWebhookData) {
        super(client);

        this._patch(data);
    }

    public override _patch(data: InteractionWebhookData) {
        this.id = data.id;
        this.token = data.token;

        this.caches = new InteractionWebhookCacheManager(this.client, this);

        return this;
    }

    public get url() {
        return `${this.client.rest._options.baseURL}/webhooks/${this.id}/${this.token}`;
    }

    public send(data: CreateWebhookMessageData, options?: CreateWebhookMessageOptions) {
        return this.client.caches.webhooks.createMessage(this.id, this.token, data, options);
    }
}
