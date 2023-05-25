import {
    type Client,
    type Snowflake,
    type ImageOptions,
    type Guild,
    type APIGuild,
    type FetchGuildOptions,
    SnowflakeUtil,
    APIInviteGuild,
    OAuth2Guild,
} from '../../index';
import { enumToObject } from '@paqujs/shared';
import { GuildFeature } from 'discord-api-types/v10';
import { BaseStructure } from './BaseStructure';

export class BaseGuild extends BaseStructure {
    public id!: Snowflake;
    public name!: string;
    public icon!: string | null;
    public features!: (keyof typeof GuildFeature)[];

    public constructor(client: Client, data: APIGuild | APIInviteGuild) {
        super(client);

        this._patch(data);
    }

    public override _patch(data: APIGuild | APIInviteGuild) {
        this.id = data.id;
        this.name = data.name;
        this.features = data.features.map((feature) => enumToObject(GuildFeature)[feature]);
        this.icon = data.icon ?? null;

        return this;
    }

    public get createdTimestamp() {
        return SnowflakeUtil.timestampFrom(this.id);
    }

    public get createdAt() {
        return new Date(this.createdTimestamp);
    }

    public get url() {
        return `https://discordapp.com/guilds/${this.id}`;
    }

    public iconURL({ dynamic, size, format }: ImageOptions = { dynamic: true, size: 1024 }) {
        return this.icon
            ? `https://cdn.discordapp.com/icons/${this.id}/${this.icon}.${
                  dynamic && this.icon.startsWith('a_') ? 'gif' : format ?? 'png'
              }?size=${size ?? 1024}`
            : null;
    }

    public async fetch(options?: FetchGuildOptions): Promise<Guild | OAuth2Guild> {
        return (await this.client.caches.guilds.fetch(this.id, options)) as Guild | OAuth2Guild;
    }

    public toString() {
        return this.name;
    }
}
