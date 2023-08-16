import {
    type Snowflake,
    type Client,
    type FetchCommandOptions,
    type APIApplicationCommand,
    type Collectionable,
    type CreateCommandData,
    type EditCommandData,
    ApplicationCommand,
} from '../../index';
import { ApplicationCommandType } from 'discord-api-types/v10';
import { Collection } from '@paqujs/shared';
import { CachedManager } from '../base/CachedManager';

export class ClientCommandManager extends CachedManager<Snowflake, ApplicationCommand> {
    public constructor(client: Client) {
        super(client);
    }

    public async fetch(
        id?: string,
        { force }: FetchCommandOptions = { force: false },
    ): Promise<Collectionable<Snowflake, ApplicationCommand>> {
        if (id) {
            let _command = this.cache.get(id)!;

            if (!force && _command) {
                return _command;
            } else {
                const command = await this.client.rest.get<APIApplicationCommand>(
                    `/applications/${this.client.user!.id}/commands/${id}`,
                );

                if (_command) {
                    _command = _command._patch(command);
                }

                return this.cache.setAndReturnValue(
                    command.id!,
                    _command ?? new ApplicationCommand(this.client, command),
                );
            }
        } else {
            const commands = await this.client.rest.get<APIApplicationCommand[]>(
                `/applications/${this.client.user!.id}/commands`,
            );

            const result = new Collection<Snowflake, ApplicationCommand>();

            for (const command of commands) {
                let _command = this.cache.get(command.id!);

                if (_command) {
                    _command = _command._patch(command);
                }

                this.cache.set(
                    command.id!,
                    _command ?? new ApplicationCommand(this.client, command),
                );
            }

            this.cache.clear();
            this.cache.concat(result);

            return this.cache;
        }
    }

    public async create(data: CreateCommandData) {
        if (typeof data.type !== 'number') {
            data.type = ApplicationCommandType[
                data.type
            ] as unknown as keyof typeof ApplicationCommandType;
        }

        const command = await this.client.rest.post<APIApplicationCommand>(
            `/applications/${this.client.user!.id}/commands`,
            { body: data },
        );

        return this.cache.setAndReturnValue(
            command.id,
            new ApplicationCommand(this.client, command),
        );
    }

    public async edit(id: Snowflake, data: EditCommandData) {
        const command = await this.client.rest.patch<APIApplicationCommand>(
            `/applications/${this.client.user!.id}/commands/${id}`,
            { body: data },
        );

        return this.cache.setAndReturnValue(
            command.id,
            new ApplicationCommand(this.client, command),
        );
    }

    public delete(id: Snowflake) {
        this.cache.delete(id);

        return this.client.rest.delete<void>(
            `/applications/${this.client.user!.id}/commands/${id}`,
        );
    }

    public async set(commands: CreateCommandData[]) {
        for (const command of commands) {
            if (typeof command.type !== 'number') {
                command.type = ApplicationCommandType[
                    command.type
                ] as unknown as keyof typeof ApplicationCommandType;
            }
        }

        const result = await this.client.rest.put<APIApplicationCommand[]>(
            `/applications/${this.client.user!.id}/commands`,
            { body: commands },
        );

        const collection = new Collection<Snowflake, ApplicationCommand>(
            result.map((command) => [command.id, new ApplicationCommand(this.client, command)]),
        );

        this.cache.clear();
        this.cache.concat(collection);

        return this.cache;
    }
}
