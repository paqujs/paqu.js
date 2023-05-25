import { type Client, type Snowflake, APIApplicationCommandInteraction } from '../../index';
import { ApplicationCommandType } from 'discord-api-types/v10';
import { BaseInteraction } from './BaseInteraction';

export class BaseCommandInteraction extends BaseInteraction {
    public commandGuildId!: Snowflake | null;
    public commandId!: Snowflake;
    public commandName!: string;
    public commandType!: keyof typeof ApplicationCommandType;

    public constructor(client: Client, data: APIApplicationCommandInteraction) {
        super(client, data);

        this._patch(data);
    }

    public override _patch(data: APIApplicationCommandInteraction) {
        super._patch(data);

        this.commandGuildId = data.data.guild_id ?? null;
        this.commandId = data.data.id;
        this.commandName = data.data.name;
        this.commandType = ApplicationCommandType[
            data.data.type
        ] as keyof typeof ApplicationCommandType;

        return this;
    }

    public get sourceGuild() {
        return this.client.caches.guilds.cache.get(this.commandGuildId);
    }
}
