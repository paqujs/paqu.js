import {
    type APIUnavailableGuild,
    type Client,
    type Snowflake,
    type FetchGuildOptions,
    type Guild,
    SnowflakeUtil,
} from '../../index';
import { BaseStructure } from '../base/BaseStructure';

export class UnavailableGuild extends BaseStructure {
    public id!: Snowflake;
    public available!: boolean;

    public constructor(client: Client, data: APIUnavailableGuild) {
        super(client);

        this._patch(data);
    }

    public override _patch(data: APIUnavailableGuild) {
        this.id = data.id;
        this.available = !data.unavailable;

        return this;
    }

    public get createdTimestamp() {
        return SnowflakeUtil.timestampFrom(this.id);
    }

    public get createdAt() {
        return new Date(this.createdTimestamp);
    }

    public async fetch(options?: FetchGuildOptions) {
        return (await this.client.caches.guilds.fetch(this.id, options)) as Guild;
    }
}
