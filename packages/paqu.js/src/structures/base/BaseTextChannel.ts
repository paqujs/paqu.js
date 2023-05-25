import type { Client, APITextBasedChannelResolvable, Snowflake } from '../../index';

import { BaseChannel } from './BaseChannel';

export class BaseTextChannel extends BaseChannel {
    public lastMessageId!: Snowflake | null;

    public constructor(client: Client, data: APITextBasedChannelResolvable) {
        super(client, data);

        this._patch(data);
    }

    public override _patch(data: APITextBasedChannelResolvable) {
        super._patch(data);

        this.lastMessageId = data.last_message_id ?? null;

        return this;
    }
}
