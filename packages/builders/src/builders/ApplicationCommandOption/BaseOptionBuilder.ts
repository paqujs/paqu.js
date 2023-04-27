import { type LocalizationMap, ApplicationCommandOptionType } from 'discord-api-types/v10';
import { BaseBuilder } from '../../index';

export interface ApplicationCommandOptionBase {
    type?: ApplicationCommandOptionType;
    description?: string;
    description_localizations?: LocalizationMap;
    name?: string;
    name_localizations?: LocalizationMap;
    required?: boolean;
}

export class ApplicationCommandBaseOptionBuilder<
    T = ApplicationCommandOptionBase,
> extends BaseBuilder<T> {
    public type: ApplicationCommandOptionType;
    public description!: string;
    public description_localizations?: LocalizationMap;
    public name!: string;
    public name_localizations?: LocalizationMap;
    public required: boolean;

    public constructor(data?: ApplicationCommandOptionBase) {
        super();

        this.type = data.type ?? ApplicationCommandOptionType.String;
        this.description = data?.description;
        this.description_localizations = data?.description_localizations ?? {};
        this.name = data?.name;
        this.name_localizations = data?.name_localizations ?? {};
        this.required = data?.required ?? false;
    }

    public setDescription(description: string) {
        return this.set('description', description);
    }

    public setDescriptionLocalizations(localizations: LocalizationMap) {
        return this.set('description_localizations', localizations);
    }

    public setName(name: string) {
        return this.set('name', name);
    }

    public setNameLocalizations(localizations: LocalizationMap) {
        return this.set('name_localizations', localizations);
    }

    public setRequired(required: boolean) {
        return this.set('required', required);
    }

    public static from(data: ApplicationCommandOptionBase) {
        return new ApplicationCommandBaseOptionBuilder(data);
    }
}
