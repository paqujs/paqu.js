import {
    type APIApplicationCommandAttachmentOption,
    ApplicationCommandOptionType,
} from 'discord-api-types/v10';

import { ApplicationCommandBaseOptionBuilder } from './BaseOptionBuilder';

export class ApplicationCommandAttachmentOptionBuilder extends ApplicationCommandBaseOptionBuilder<APIApplicationCommandAttachmentOption> {
    public constructor(data?: Omit<APIApplicationCommandAttachmentOption, 'type'>) {
        super({ ...data, type: ApplicationCommandOptionType.Attachment });
    }

    public static from(data: Omit<APIApplicationCommandAttachmentOption, 'type'>) {
        return new ApplicationCommandAttachmentOptionBuilder(data);
    }
}
