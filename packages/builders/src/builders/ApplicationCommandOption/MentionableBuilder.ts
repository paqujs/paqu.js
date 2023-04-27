import {
    APIApplicationCommandMentionableOption,
    ApplicationCommandOptionType,
} from 'discord-api-types/v10';

import { ApplicationCommandBaseOptionBuilder } from './BaseOptionBuilder';

export class ApplicationCommandMentionableOptionBuilder extends ApplicationCommandBaseOptionBuilder<APIApplicationCommandMentionableOption> {
    public constructor(data?: Omit<APIApplicationCommandMentionableOption, 'type'>) {
        super({ ...data, type: ApplicationCommandOptionType.Mentionable });
    }

    public static from(data: Omit<APIApplicationCommandMentionableOption, 'type'>) {
        return new ApplicationCommandMentionableOptionBuilder(data);
    }
}
