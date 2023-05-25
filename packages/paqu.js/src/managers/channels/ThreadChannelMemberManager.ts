import type { Snowflake, Client, ThreadChannel, FetchOptions, ThreadMember } from '../../index';

import { CachedManager } from '../base/CachedManager';

export class ThreadChannelMemberManager extends CachedManager<Snowflake, ThreadMember> {
    public channel: ThreadChannel;

    public constructor(client: Client, channel: ThreadChannel) {
        super(client);

        this.channel = channel;
    }

    public async add(id: Snowflake): Promise<void> {
        return await this.channel.guild.caches.channels.addThreadMember(this.channel.id, id);
    }

    public async remove(id: Snowflake): Promise<void> {
        return await this.channel.guild.caches.channels.removeThreadMember(this.channel.id, id);
    }

    public async fetch(id?: Snowflake, options?: FetchOptions) {
        return await this.channel.guild.caches.channels.fetchThreadMembers(
            this.channel.id,
            id,
            options,
        );
    }
}
