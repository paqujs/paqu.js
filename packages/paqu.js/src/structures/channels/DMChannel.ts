import {
    type APIDMChannel,
    type Client,
    type CreateMessageData,
    User,
    TextBasedChannelCacheManager,
    EditChannelData,
    FetchOptions,
    MessageCollectorOptions,
    MessageCollector,
} from '../../index';

import { BaseTextChannel } from '../base/BaseTextChannel';

export class DMChannel extends BaseTextChannel {
    public recipient!: User;
    public lastPinTimestamp!: number | null;
    public caches!: TextBasedChannelCacheManager;

    public constructor(client: Client, data: APIDMChannel) {
        super(client, data);

        this._patch(data);
    }

    public override _patch(data: APIDMChannel) {
        super._patch(data);

        const recipient = data.recipients![0]!;

        let _user = this.client.caches.users.cache.get(recipient.id);

        if (_user) {
            _user = _user._patch(recipient);
            this.recipient = this.client.caches.users.cache.setAndReturnValue(_user.id, _user);
        } else {
            _user = new User(this.client, recipient);

            this.recipient = _user;
            this.client.caches.users.cache.set(_user.id, _user);
        }

        this.lastPinTimestamp = data.last_pin_timestamp
            ? new Date(data.last_pin_timestamp).getTime()
            : null;

        this.caches = new TextBasedChannelCacheManager(this.client, this);

        return this;
    }

    public get lastMessage() {
        return this.caches.messages.cache.get(this.lastMessageId!);
    }

    public override async fetch(options?: FetchOptions) {
        return (await super.fetch(options)) as DMChannel;
    }

    public override async edit(data: EditChannelData, reason?: string) {
        return (await super.edit(data, reason)) as DMChannel;
    }

    public async send(data: CreateMessageData | string) {
        return await this.caches.messages.create(data);
    }

    public createMessageCollector(options?: MessageCollectorOptions) {
        return new MessageCollector(this.client, this, options);
    }
}
