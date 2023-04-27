import {
    type APIApplicationCommandIntegerOption,
    type APIApplicationCommandOptionChoice,
    ApplicationCommandOptionType,
} from 'discord-api-types/v10';

import { ApplicationCommandBaseOptionBuilder } from './BaseOptionBuilder';

export type ApplicationCommandIntegerOption = Omit<APIApplicationCommandIntegerOption, 'type'> & {
    choices?: APIApplicationCommandOptionChoice<number>[];
};

export class ApplicationCommandIntegerOptionBuilder extends ApplicationCommandBaseOptionBuilder<APIApplicationCommandIntegerOption> {
    public autocomplete: boolean;
    public max_length?: number;
    public min_length?: number;
    public choices!: APIApplicationCommandOptionChoice<number>[];

    public constructor(data?: ApplicationCommandIntegerOption) {
        super({ ...data, type: ApplicationCommandOptionType.Integer });

        this.autocomplete = data?.autocomplete ?? false;
        this.max_length = data?.max_value;
        this.min_length = data?.min_value;
        this.choices = data?.choices ?? [];
    }

    public setAutocomplete(autocomplete: boolean) {
        return this.set('autocomplete', autocomplete);
    }

    public setMaxValue(maxValue: number) {
        return this.set('max_value', maxValue);
    }

    public setMinValue(minValue: number) {
        return this.set('min_value', minValue);
    }

    public addChoices(choices: APIApplicationCommandOptionChoice<number>[]) {
        return this.set('choices', this.choices.concat(choices));
    }

    public static from(data: ApplicationCommandIntegerOption) {
        return new ApplicationCommandIntegerOptionBuilder(data);
    }
}
