import {
    type FetchOptions,
    type Snowflake,
    type APIThreadMember,
    type Client,
    type ThreadChannel,
    GuildMember,
} from '../../index';

import { BaseStructure } from '../base/BaseStructure';

export class ThreadMember extends BaseStructure {
    public threadId!: Snowflake | null;
    public userId!: Snowflake | null;
    public joinedTimestamp!: number;
    public flags!: number;
    public member!: GuildMember | null;

    public constructor(client: Client, data: APIThreadMember) {
        super(client);

        this._patch(data);
    }

    public override _patch(data: APIThreadMember) {
        this.joinedTimestamp = new Date(data.join_timestamp).getTime();
        this.flags = data.flags;

        if ('user_id' in data) {
            this.userId = data.user_id ?? null;
        } else {
            this.userId ??= null;
        }

        if ('id' in data) {
            this.threadId = data.id ?? null;
        } else {
            this.threadId ??= null;
        }

        if ('member' in data) {
            this.member = this.guild.caches.members.cache.get(data.member.user.id)
                ? this.guild.caches.members.cache.get(data.member.user.id)._patch(data.member)
                : this.guild.caches.members.cache.setAndReturnValue(
                      this.userId,
                      new GuildMember(this.client, this.guild, data.member),
                  );
        } else {
            this.member = this.guild.caches.members.cache.get(this.userId!)! ?? null;
        }

        return this;
    }

    public get guild() {
        return this.thread.guild;
    }

    public get joinedAt() {
        return new Date(this.joinedTimestamp);
    }

    public get user() {
        return this.client.caches.users.cache.get(this.userId!);
    }

    public get thread() {
        return this.client.caches.channels.cache.get(this.threadId!) as ThreadChannel | undefined;
    }

    public async remove() {
        return await this.thread!.caches.members.remove(this.userId!);
    }

    public async fetch(options?: FetchOptions) {
        return await this.thread!.caches.members.fetch(this.userId!, options);
    }
}
