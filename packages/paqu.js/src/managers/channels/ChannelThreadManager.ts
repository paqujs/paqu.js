import type {
    ThreadableChannelResolvable,
    Snowflake,
    Client,
    FetchOptions,
    FetchArchivedThreadOptions,
    StartThreadData,
    ThreadChannel,
} from '../../index';

import { CachedManager } from '../base/CachedManager';

export class ChannelThreadManager extends CachedManager<Snowflake, ThreadChannel> {
    public channel: ThreadableChannelResolvable;

    public constructor(client: Client, channel: ThreadableChannelResolvable) {
        super(client);

        this.channel = channel;
    }

    public async start(data: StartThreadData, reason?: string | null, messageId?: Snowflake) {
        return await this.channel.guild.caches.channels.startThread(
            this.channel.id,
            data,
            reason,
            messageId,
        );
    }

    public async join() {
        return await this.channel.guild.caches.channels.joinThread(this.channel.id);
    }

    public async leave() {
        return await this.channel.guild.caches.channels.leaveThread(this.channel.id);
    }

    public async addMember(id: Snowflake) {
        return await this.channel.guild.caches.channels.addThreadMember(this.channel.id, id);
    }

    public async removeMember(id: Snowflake) {
        return await this.channel.guild.caches.channels.removeThreadMember(this.channel.id, id);
    }

    public async fetchMembers(id?: Snowflake, options?: FetchOptions) {
        return await this.channel.guild.caches.channels.fetchThreadMembers(
            this.channel.id,
            id,
            options,
        );
    }

    public async fetchActives() {
        const activeThreads = await this.channel.guild.caches.channels.fetchActiveThreads();
        const is = activeThreads.filter((thread) => thread.parentId === this.channel.id);

        this.cache.concat(is);

        return is;
    }

    public async fetchPublicArchived(options?: FetchArchivedThreadOptions) {
        const publicThreads = await this.channel.guild.caches.channels.fetchPublicArchivedThreads(
            this.channel.id,
            options,
        );

        const is = publicThreads.threads.filter((thread) => thread.parentId === this.channel.id);

        this.cache.concat(is);

        return {
            threads: is,
            hasMore: publicThreads.hasMore,
        };
    }

    public async fetchPrivateArchived(options?: FetchArchivedThreadOptions) {
        const privateThreads = await this.channel.guild.caches.channels.fetchPrivateArchivedThreads(
            this.channel.id,
            options,
        );

        const is = privateThreads.threads.filter((thread) => thread.parentId === this.channel.id);

        this.cache.concat(is);

        return {
            threads: is,
            hasMore: privateThreads.hasMore,
        };
    }

    public async fetchJoins(options?: FetchArchivedThreadOptions) {
        return await this.channel.guild.caches.channels.fetchJoinedThreads(
            this.channel.id,
            options,
        );
    }
}
