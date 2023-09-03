import {
    type Snowflake,
    type Client,
    type Collectionable,
    type FetchCommandOptions,
    type ApplicationCommand,
    type CreateCommandData,
    type Guild,
    type EditCommandData,
    GuildCommandPermissionsManager,
} from '../../index';
import { Collection } from '@paqujs/shared';
import { CachedManager } from '../base/CachedManager';

export class GuildCommandManager extends CachedManager<Snowflake, ApplicationCommand> {
    public guild: Guild;
    public permissions!: GuildCommandPermissionsManager;

    public constructor(client: Client, guild: Guild) {
        super(client);

        this.guild = guild;
        this.permissions = new GuildCommandPermissionsManager(client, guild);
    }

    public async fetch(
        id?: string | null,
        { force, with_localizations }: FetchCommandOptions = {
            force: false,
            with_localizations: false,
        },
    ): Promise<Collectionable<Snowflake, ApplicationCommand>> {
        if (id) {
            const _command = this.cache.get(id);

            if (_command && !force) {
                return _command;
            } else {
                const command = (await this.client.caches.guilds.fetchCommands(this.guild.id, id, {
                    with_localizations,
                })) as ApplicationCommand;

                return this.cache.setAndReturnValue(command.id, command);
            }
        } else {
            const commands = (await this.client.caches.guilds.fetchCommands(this.guild.id, null, {
                with_localizations,
            })) as Collection<Snowflake, ApplicationCommand>;

            this.cache.clear();
            this.cache.concat(commands);

            return this.cache;
        }
    }

    public async create(data: CreateCommandData) {
        const command = await this.client.caches.guilds.createCommand(this.guild.id, data);

        return this.cache.setAndReturnValue(command.id, command);
    }

    public async edit(id: Snowflake, data: EditCommandData) {
        const command = await this.client.caches.guilds.editCommand(this.guild.id, id, data);

        return this.cache.setAndReturnValue(command.id, command);
    }

    public delete(id: Snowflake) {
        this.cache.delete(id);

        return this.client.caches.guilds.deleteCommand(this.guild.id, id);
    }

    public async set(id: Snowflake, commands: CreateCommandData[]) {
        const result = await this.client.caches.guilds.setCommands(id, commands);

        this.cache.clear();
        this.cache.concat(result);

        return this.cache;
    }
}
