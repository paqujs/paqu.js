import type {
    Client,
    Guild,
    APIGuildBasedChannelResolvable,
    FetchOptions,
    GuildBasedChannelResolvable,
    Snowflake,
    CategoryChannel,
    EditAndCreateGuildChannelData,
    APIOverwrite,
} from '../../index';

import { BaseChannel } from './BaseChannel';

export class BaseGuildChannel extends BaseChannel {
    public guild: Guild;
    public parentId!: Snowflake | null;
    public rawPosition!: number;
    public rawPermissionOverwrites!: APIOverwrite[];

    public constructor(client: Client, guild: Guild, data: APIGuildBasedChannelResolvable) {
        super(client, data);

        this.guild = guild;

        this._patch(data);
    }

    public override _patch(data: APIGuildBasedChannelResolvable) {
        super._patch(data);

        this.parentId = data.parent_id ?? null;
        this.rawPosition = data.position ?? 0;
        this.rawPermissionOverwrites = data.permission_overwrites ?? [];

        return this;
    }

    public get url() {
        return `https://discordapp.com/channels/${this.guild.id}/${this.id}`;
    }

    public get position() {
        return this.guild.caches.channels.cache.keyArray().indexOf(this.id);
    }

    public get parent() {
        return this.guild.caches.channels.cache.get(this.parentId!) as CategoryChannel | undefined;
    }

    public override async fetch(options?: FetchOptions) {
        return (await super.fetch(options)) as GuildBasedChannelResolvable;
    }

    public override async edit(data: EditAndCreateGuildChannelData, reason?: string) {
        if (!data.type) {
            data.type = this.type;
        }

        if (
            !['AnnouncementThread', 'PublicThread', 'PrivateThread'].includes(this.type) &&
            !('flags' in data)
        ) {
            data.flags = this.flags.bitset;
        }

        return (await super.edit(data, reason)) as GuildBasedChannelResolvable;
    }

    public permissionsFor(id: Snowflake) {
        return this.guild.permissionsFor(id);
    }

    public overwritesFor(id: Snowflake) {
        return this.guild.overwritesFor(this.id, id);
    }
}
