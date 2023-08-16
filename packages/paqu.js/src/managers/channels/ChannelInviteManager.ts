import type {
    Snowflake,
    Client,
    GuildBasedInvitableChannelResolvable,
    CreateInviteData,
    FetchInviteOptions,
    Invite,
} from '../../index';

import { CachedManager } from '../base/CachedManager';

export class ChannelInviteManager extends CachedManager<Snowflake, Invite> {
    public channel: GuildBasedInvitableChannelResolvable;

    public constructor(client: Client, channel: GuildBasedInvitableChannelResolvable) {
        super(client);

        this.channel = channel;
    }

    public create(data?: CreateInviteData, reason?: string) {
        return this.channel.guild.caches.channels.createInvite(this.channel.id, data, reason);
    }

    public fetch(code?: string, options?: FetchInviteOptions) {
        return this.channel.guild.caches.channels.fetchInvites(
            this.channel.id,
            code,
            options,
        );
    }

    public delete(code: string, reason?: string) {
        return this.channel.guild.caches.channels.deleteInvite(code, reason);
    }
}
