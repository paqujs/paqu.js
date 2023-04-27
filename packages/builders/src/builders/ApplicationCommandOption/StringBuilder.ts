import {
    type APIApplicationCommandStringOption,
    type APIApplicationCommandOptionChoice,
    ApplicationCommandOptionType,
} from 'discord-api-types/v10';

import { ApplicationCommandBaseOptionBuilder } from './BaseOptionBuilder';

export type ApplicationCommandStringOption = Omit<APIApplicationCommandStringOption, 'type'> & {
    choices?: APIApplicationCommandOptionChoice<string>[];
};

export class ApplicationCommandStringOptionBuilder extends ApplicationCommandBaseOptionBuilder<APIApplicationCommandStringOption> {
    public autocomplete: boolean;
    public max_length?: number;
    public min_length?: number;
    public choices!: APIApplicationCommandOptionChoice<string>[];

    public constructor(data?: ApplicationCommandStringOption) {
        super({ ...data, type: ApplicationCommandOptionType.String });

        this.autocomplete = data?.autocomplete ?? false;
        this.max_length = data?.max_length;
        this.min_length = data?.min_length;
        this.required = data?.required ?? false;
        this.choices = data?.choices ?? [];
    }

    public setAutocomplete(autocomplete: boolean) {
        return this.set('autocomplete', autocomplete);
    }

    public setMaxLength(maxLength: number) {
        return this.set('max_length', maxLength);
    }

    public setMinLength(minLength: number) {
        return this.set('min_length', minLength);
    }

    public addChoices(choices: APIApplicationCommandOptionChoice<string>[]) {
        return this.set('choices', this.choices.concat(choices));
    }

    public static from(data: ApplicationCommandStringOption) {
        return new ApplicationCommandStringOptionBuilder(data);
    }
}
