import {
    type Client,
    type Snowflake,
    type FetchOptions,
    type APIAnyChannel,
    type EditChannelData,
    SnowflakeUtil,
} from '../../index';
import { ChannelFlagsBitField } from '@paqujs/bitfields';
import { ChannelType } from 'discord-api-types/v10';

import { BaseStructure } from './BaseStructure';

export class BaseChannel extends BaseStructure {
    public id!: Snowflake;
    public name!: string | null;
    public type!: keyof typeof ChannelType;
    public flags!: ChannelFlagsBitField;

    public constructor(client: Client, data: APIAnyChannel) {
        super(client);

        this._patch(data);
    }

    public override _patch(data: APIAnyChannel) {
        this.id = data.id;
        this.name = data.name ?? null;
        this.type = ChannelType[data.type] as keyof typeof ChannelType;
        this.flags = new ChannelFlagsBitField(data.flags ?? 0);

        return this;
    }

    public get createdTimestamp() {
        return SnowflakeUtil.timestampFrom(this.id);
    }

    public get createdAt() {
        return new Date(this.createdTimestamp);
    }

    public get url() {
        return `https://discordapp.com/channels/@me/${this.id}`;
    }

    public async delete(reason?: string) {
        return await this.client.caches.channels.delete(this.id, reason);
    }

    public async fetch(options?: FetchOptions) {
        return await this.client.caches.channels.fetch(this.id, options);
    }

    public async edit(data: EditChannelData, reason?: string) {
        if (!data.name) {
            data.name = this.name;
        }

        return await this.client.caches.channels.edit(this.id, data, reason);
    }

    public toString() {
        return `<#${this.id}>`;
    }
}
