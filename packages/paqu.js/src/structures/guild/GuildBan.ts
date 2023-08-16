import type {
    Client,
    APIBan,
    Guild,
    Snowflake,
    GatewayGuildBanAddDispatchData,
    FetchBanOptions,
} from '../../index';

import { BaseStructure } from '../base/BaseStructure';

export class GuildBan extends BaseStructure {
    public userId!: Snowflake;
    public reason!: string | null;
    public guild: Guild;

    public constructor(
        client: Client,
        guild: Guild,
        data: APIBan | GatewayGuildBanAddDispatchData,
    ) {
        super(client);

        this.guild = guild;

        this._patch(data);
    }

    public override _patch(data: GatewayGuildBanAddDispatchData | APIBan) {
        this.userId = data.user.id;

        if ('reason' in data) {
            this.reason = data.reason;
        } else {
            this.reason ??= null;
        }

        return this;
    }

    public get user() {
        return this.client.caches.users.cache.get(this.userId);
    }

    public get member() {
        return this.guild.caches.members.cache.get(this.userId);
    }

    public fetch(options?: FetchBanOptions) {
        return this.guild.caches.bans.fetch(this.userId, options);
    }

    public remove(reason?: string) {
        return this.guild.caches.bans.remove(this.userId, reason);
    }

    public toString() {
        return this.user!.toString();
    }
}
