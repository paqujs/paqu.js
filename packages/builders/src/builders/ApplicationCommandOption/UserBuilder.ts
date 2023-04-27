import {
    type APIApplicationCommandUserOption,
    ApplicationCommandOptionType,
} from 'discord-api-types/v10';

import { ApplicationCommandBaseOptionBuilder } from './BaseOptionBuilder';

export class ApplicationCommandUserOptionBuilder extends ApplicationCommandBaseOptionBuilder<APIApplicationCommandUserOption> {
    public constructor(data?: Omit<APIApplicationCommandUserOption, 'type'>) {
        super({ ...data, type: ApplicationCommandOptionType.User });
    }

    public static from(data: Omit<APIApplicationCommandUserOption, 'type'>) {
        return new ApplicationCommandUserOptionBuilder(data);
    }
}
