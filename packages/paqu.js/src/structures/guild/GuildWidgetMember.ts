import type { Snowflake, Guild, Client, APIGuildWidgetMember, PresenceStatus } from '../../index';

import { BaseStructure } from '../base/BaseStructure';

export class GuildWidgetMember extends BaseStructure {
    public id!: Snowflake;
    public activity!: { name: string } | null;
    public avatar!: string | null;
    public avatarURL!: string | null;
    public discriminator!: string;
    public status!: PresenceStatus;
    public username!: string;
    public guild: Guild;

    public constructor(client: Client, guild: Guild, data: APIGuildWidgetMember) {
        super(client);

        this.guild = guild;

        this._patch(data);
    }

    public override _patch(data: APIGuildWidgetMember) {
        this.id = data.id;
        this.activity = data.activity ?? null;
        this.avatar = data.avatar;
        this.avatarURL = data.avatar_url;
        this.discriminator = data.discriminator;
        this.status = data.status as PresenceStatus;
        this.username = data.username;

        return this;
    }

    public get user() {
        return this.client.caches.users.cache.get(this.id);
    }

    public get tag() {
        return `${this.username}#${this.discriminator}`;
    }

    public toString() {
        return this.user!.toString();
    }
}
