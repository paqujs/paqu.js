import {
    type APIGroupDMChannel,
    type Client,
    type Snowflake,
    type CreateMessageData,
    type EditGroupDMChannelData,
    type FetchOptions,
    type MessageCollectorOptions,
    User,
    GroupDMChannelCacheManager,
    MessageCollector,
} from '../../index';

import { BaseTextChannel } from '../base/BaseTextChannel';

export class GroupDMChannel extends BaseTextChannel {
    public applicationId!: string | null;
    public icon!: string | null;
    public ownerId!: Snowflake | null;
    public caches!: GroupDMChannelCacheManager;
    public lastPinTimestamp!: number | null;
    public managed!: boolean;

    public constructor(client: Client, data: APIGroupDMChannel) {
        super(client, data);

        this._patch(data);
    }

    public override _patch(data: APIGroupDMChannel) {
        super._patch(data);

        this.applicationId = data.application_id ?? null;
        this.icon = data.icon ?? null;
        this.ownerId = data.owner_id ?? null;
        this.managed = data.managed ?? false;

        this.caches = new GroupDMChannelCacheManager(this.client, this);

        if ('recipients' in data) {
            this.caches.recipients.cache.clear();

            for (const recipient of data.recipients!) {
                this.caches.recipients.cache.set(
                    recipient.id,
                    this.client.caches.users.cache.setAndReturnValue(
                        recipient.id,
                        new User(this.client, recipient),
                    ),
                );
            }
        }

        this.lastPinTimestamp = data.last_pin_timestamp
            ? new Date(data.last_pin_timestamp).getTime()
            : null;

        return this;
    }

    public get lastMessage() {
        return this.caches.messages.cache.get(this.lastMessageId!);
    }

    public override async fetch(options?: FetchOptions) {
        return (await super.fetch(options)) as GroupDMChannel;
    }

    public override async edit(data: EditGroupDMChannelData, reason?: string) {
        return (await super.edit(data, reason)) as GroupDMChannel;
    }

    public send(data: CreateMessageData | string) {
        return this.caches.messages.create(data);
    }

    public createMessageCollector(options?: MessageCollectorOptions) {
        return new MessageCollector(this.client, this, options);
    }
}
