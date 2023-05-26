import type {
    APIMessageReference,
    Client,
    Snowflake,
    TextBasedChannelResolvable,
} from '../../index';

import { BaseStructure } from '../base/BaseStructure';

export class MessageReference extends BaseStructure {
    public messageId!: Snowflake | null;
    public channelId!: Snowflake | null;
    public guildId!: Snowflake | null;
    public failIfNotExists!: boolean;

    public constructor(client: Client, data: APIMessageReference) {
        super(client);

        this._patch(data);
    }

    public override _patch(data: APIMessageReference) {
        this.messageId = data.message_id ?? null;
        this.channelId = data.channel_id ?? null;
        this.guildId = data.guild_id ?? null;

        if ('fail_if_not_exists' in data) {
            this.failIfNotExists = (data.fail_if_not_exists as boolean) ?? true;
        } else {
            this.failIfNotExists ??= true;
        }

        return this;
    }

    public get message() {
        return this.channel?.caches?.messages.cache.get(this.messageId!);
    }

    public get channel(): TextBasedChannelResolvable | undefined {
        return this.client.caches.channels.cache.get(this.channelId!) as TextBasedChannelResolvable;
    }

    public get guild() {
        return this.client.caches.guilds.cache.get(this.guildId!);
    }
}
