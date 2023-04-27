import {
    type LocalizationMap,
    type APIApplicationCommandOption,
    type RESTPostAPIApplicationCommandsJSONBody,
    ApplicationCommandType,
} from 'discord-api-types/v10';
import { type PermissionFlagsBitsResolvable, PermissionFlagsBitField } from '@paqujs/bitfields';
import {
    ApplicationCommandAttachmentOptionBuilder,
    ApplicationCommandBooleanOptionBuilder,
    ApplicationCommandChannelOptionBuilder,
    ApplicationCommandIntegerOptionBuilder,
    ApplicationCommandMentionableOptionBuilder,
    ApplicationCommandNumberOptionBuilder,
    ApplicationCommandRoleOptionBuilder,
    ApplicationCommandStringOptionBuilder,
    ApplicationCommandUserOptionBuilder,
    ApplicationCommandSubcommandOptionBuilder,
    ApplicationCommandSubcommandGroupOptionBuilder,
    BaseBuilder,
} from '../index';

export type AnyApplicationCommandOptionBuilder =
    | ApplicationCommandAttachmentOptionBuilder
    | ApplicationCommandBooleanOptionBuilder
    | ApplicationCommandChannelOptionBuilder
    | ApplicationCommandIntegerOptionBuilder
    | ApplicationCommandMentionableOptionBuilder
    | ApplicationCommandNumberOptionBuilder
    | ApplicationCommandRoleOptionBuilder
    | ApplicationCommandStringOptionBuilder
    | ApplicationCommandUserOptionBuilder
    | ApplicationCommandSubcommandOptionBuilder
    | ApplicationCommandSubcommandGroupOptionBuilder;

export type ApplicationCommandTypeResolvable =
    | keyof typeof ApplicationCommandType
    | ApplicationCommandType;

export class ApplicationCommandBuilder extends BaseBuilder<RESTPostAPIApplicationCommandsJSONBody> {
    public name!: string;
    public name_localizations?: LocalizationMap;
    public description!: string;
    public description_localizations?: LocalizationMap;
    public options?: APIApplicationCommandOption[];
    public default_member_permissions?: string;
    public dm_permission?: boolean;
    public type?: ApplicationCommandType;
    public nsfw?: boolean;

    public constructor(data?: RESTPostAPIApplicationCommandsJSONBody) {
        super();

        this.default_member_permissions = data?.default_member_permissions;
        this.description_localizations = data?.description_localizations;
        this.dm_permission = data?.dm_permission;
        this.name = data?.name;
        this.name_localizations = data?.name_localizations;
        this.options = data?.options ?? [];
        this.type = data?.type ?? ApplicationCommandType.ChatInput;
        this.nsfw = data?.nsfw ?? false;

        if ('description' in data && this.type === ApplicationCommandType.ChatInput) {
            this.description = data.description;
        }
    }

    public setDefaultMemberPermissions(permissions: PermissionFlagsBitsResolvable) {
        return this.set(
            'default_member_permissions',
            String(new PermissionFlagsBitField().set(permissions)),
        );
    }

    public setDescription(description: string) {
        return this.set('description', description);
    }

    public setDescriptionLocalizations(localizations: LocalizationMap) {
        return this.set('description_localizations', localizations);
    }

    public setDmPermission(dmPermission: boolean) {
        return this.set('dm_permission', dmPermission);
    }

    public setName(name: string) {
        return this.set('name', name);
    }

    public setNameLocalizations(localizations: LocalizationMap) {
        return this.set('name_localizations', localizations);
    }

    public setType(type: ApplicationCommandTypeResolvable) {
        return this.set('type', typeof type === 'number' ? type : ApplicationCommandType[type]);
    }

    public setNSFW(nsfw: boolean) {
        return this.set('nsfw', nsfw);
    }

    public addAttachmentOption(fn: (builder: ApplicationCommandAttachmentOptionBuilder) => void) {
        return this.#createOption(new ApplicationCommandAttachmentOptionBuilder(), fn);
    }

    public addBooleanOption(fn: (builder: ApplicationCommandBooleanOptionBuilder) => void) {
        return this.#createOption(new ApplicationCommandBooleanOptionBuilder(), fn);
    }

    public addChannelOption(fn: (builder: ApplicationCommandChannelOptionBuilder) => void) {
        return this.#createOption(new ApplicationCommandChannelOptionBuilder(), fn);
    }

    public addIntegerOption(fn: (builder: ApplicationCommandIntegerOptionBuilder) => void) {
        return this.#createOption(new ApplicationCommandIntegerOptionBuilder(), fn);
    }

    public addMentionableOption(fn: (builder: ApplicationCommandMentionableOptionBuilder) => void) {
        return this.#createOption(new ApplicationCommandMentionableOptionBuilder(), fn);
    }

    public addNumberOption(fn: (builder: ApplicationCommandNumberOptionBuilder) => void) {
        return this.#createOption(new ApplicationCommandNumberOptionBuilder(), fn);
    }

    public addRoleOption(fn: (builder: ApplicationCommandRoleOptionBuilder) => void) {
        return this.#createOption(new ApplicationCommandRoleOptionBuilder(), fn);
    }

    public addStringOption(fn: (builder: ApplicationCommandStringOptionBuilder) => void) {
        return this.#createOption(new ApplicationCommandStringOptionBuilder(), fn);
    }

    public addSubcommand(fn: (builder: ApplicationCommandSubcommandOptionBuilder) => void) {
        return this.#createOption(new ApplicationCommandSubcommandOptionBuilder(), fn);
    }

    public addSubcommandGroup(
        fn: (builder: ApplicationCommandSubcommandGroupOptionBuilder) => void,
    ) {
        return this.#createOption(new ApplicationCommandSubcommandGroupOptionBuilder(), fn);
    }

    public addUserOption(fn: (builder: ApplicationCommandUserOptionBuilder) => void) {
        return this.#createOption(new ApplicationCommandUserOptionBuilder(), fn);
    }

    #createOption(
        builder: AnyApplicationCommandOptionBuilder,
        fn: (builder: AnyApplicationCommandOptionBuilder) => void,
    ) {
        fn(builder);
        this.options.push(builder.toJSON());

        return this;
    }
}
