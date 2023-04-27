import {
    type APIApplicationCommandBooleanOption,
    ApplicationCommandOptionType,
} from 'discord-api-types/v10';

import { ApplicationCommandBaseOptionBuilder } from './BaseOptionBuilder';

export class ApplicationCommandBooleanOptionBuilder extends ApplicationCommandBaseOptionBuilder<APIApplicationCommandBooleanOption> {
    public constructor(data?: Omit<APIApplicationCommandBooleanOption, 'type'>) {
        super({ ...data, type: ApplicationCommandOptionType.Boolean });
    }

    public static from(data: Omit<APIApplicationCommandBooleanOption, 'type'>) {
        return new ApplicationCommandBooleanOptionBuilder(data);
    }
}
