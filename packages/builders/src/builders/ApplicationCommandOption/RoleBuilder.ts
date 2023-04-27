import {
    type APIApplicationCommandRoleOption,
    ApplicationCommandOptionType,
} from 'discord-api-types/v10';

import { ApplicationCommandBaseOptionBuilder } from './BaseOptionBuilder';

export class ApplicationCommandRoleOptionBuilder extends ApplicationCommandBaseOptionBuilder<APIApplicationCommandRoleOption> {
    public constructor(data?: Omit<APIApplicationCommandRoleOption, 'type'>) {
        super({ ...data, type: ApplicationCommandOptionType.Role });
    }

    public static from(data: Omit<APIApplicationCommandRoleOption, 'type'>) {
        return new ApplicationCommandRoleOptionBuilder(data);
    }
}
