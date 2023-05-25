import {
    type Client,
    type APIGuildWidget,
    type Snowflake,
    GuildWidgetChannel,
    GuildWidgetMember,
} from '../../index';
import { Collection } from '@paqujs/shared';
import { BaseStructure } from '../base/BaseStructure';

export class GuildWidget extends BaseStructure {
    public id!: Snowflake;
    public name!: string;
    public instantInvite!: string | null;
    public presenceCount!: number;
    public channels!: Collection<Snowflake, GuildWidgetChannel>;
    public members!: Collection<Snowflake, GuildWidgetMember>;
    public guildId: Snowflake;

    public constructor(client: Client, guildId: Snowflake, data: APIGuildWidget) {
        super(client);

        this.guildId = guildId;

        this._patch(data);
    }

    public override _patch(data: APIGuildWidget) {
        this.id = data.id;
        this.name = data.name;
        this.instantInvite = data.instant_invite;
        this.presenceCount = data.presence_count;

        this.channels = new Collection();
        this.members = new Collection();

        for (const channel of data.channels) {
            this.channels.set(
                channel.id,
                new GuildWidgetChannel(this.client, this.guild!, channel),
            );
        }

        for (const member of data.members) {
            this.members.set(member.id, new GuildWidgetMember(this.client, this.guild!, member));
        }

        return this;
    }

    public get guild() {
        return this.client.caches.guilds.cache.get(this.guildId)!;
    }

    public async fetch() {
        return await this.client.caches.guilds.fetchWidgetSettings(this.id);
    }

    public toString() {
        return this.name;
    }
}
