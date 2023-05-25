import type { Client, Guild, APIGuildWidgetChannel, Snowflake } from '../../index';

import { BaseStructure } from '../base/BaseStructure';

export class GuildWidgetChannel extends BaseStructure {
    public guild: Guild;
    public id!: Snowflake;
    public name!: string;
    public rawPosition!: number;

    public constructor(client: Client, guild: Guild, data: APIGuildWidgetChannel) {
        super(client);

        this.guild = guild;

        this._patch(data);
    }

    public override _patch(data: APIGuildWidgetChannel) {
        this.id = data.id;
        this.name = data.name;
        this.rawPosition = data.position;

        return this;
    }

    public get channel() {
        return this.guild.caches.channels.cache.get(this.id);
    }

    public get position() {
        return this.guild.caches.channels.cache.keyArray().indexOf(this.id);
    }

    public toString() {
        return this.channel!.toString();
    }
}
