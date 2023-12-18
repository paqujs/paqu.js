import {
    type APIApplication,
    type Client,
    type Snowflake,
    type ImageOptions,
    SnowflakeUtil,
} from '../../index';

import { BaseStructure } from './BaseStructure';

export class BaseApplication extends BaseStructure {
    public icon!: string | null;
    public id!: Snowflake | null;
    public name!: string | null;
    public description!: string | null;

    public constructor(client: Client, data: Partial<APIApplication>) {
        super(client);

        this._patch(data);
    }

    public override _patch(data: Partial<APIApplication>) {
        this.icon = data.icon ?? null;
        this.id = data.id ?? null;
        this.name = data.name ?? null;
        this.description = data.description ?? null;

        return this;
    }

    public get createdTimestamp() {
        return SnowflakeUtil.timestampFrom(this.id);
    }

    public get createdAt() {
        return new Date(this.createdTimestamp);
    }

    public iconURL({ dynamic, size, format }: ImageOptions = { dynamic: true, size: 1024 }) {
        return this.icon
            ? `https://cdn.discordapp.com/app-icons/${this.id}/${this.icon}.${
                  dynamic && this.icon.startsWith('a_') ? 'gif' : format ?? 'png'
              }?size=${size ?? 1024}`
            : null;
    }

    public toString() {
        return this.name;
    }
}
