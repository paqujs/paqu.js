import {
    type APIApplicationCommandSubcommandOption,
    type APIApplicationCommandBasicOption,
    ApplicationCommandOptionType,
} from 'discord-api-types/v10';
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
    ApplicationCommandBaseOptionBuilder,
    AnyApplicationCommandOptionBuilder,
} from '../index';

export class ApplicationCommandSubcommandOptionBuilder extends ApplicationCommandBaseOptionBuilder<APIApplicationCommandSubcommandOption> {
    public options!: APIApplicationCommandBasicOption[];

    public constructor(data?: Omit<APIApplicationCommandSubcommandOption, 'type'>) {
        super({ ...data, type: ApplicationCommandOptionType.Subcommand });

        this.options = data?.options ?? [];
    }

    public addAttachmentOption(fn: (builder: ApplicationCommandAttachmentOptionBuilder) => void) {
        this.#createOption(new ApplicationCommandAttachmentOptionBuilder(), fn);
        return this;
    }

    public addBooleanOption(fn: (builder: ApplicationCommandBooleanOptionBuilder) => void) {
        this.#createOption(new ApplicationCommandBooleanOptionBuilder(), fn);
        return this;
    }

    public addChannelOption(fn: (builder: ApplicationCommandChannelOptionBuilder) => void) {
        this.#createOption(new ApplicationCommandChannelOptionBuilder(), fn);
        return this;
    }

    public addIntegerOption(fn: (builder: ApplicationCommandIntegerOptionBuilder) => void) {
        this.#createOption(new ApplicationCommandIntegerOptionBuilder(), fn);
        return this;
    }

    public addMentionableOption(fn: (builder: ApplicationCommandMentionableOptionBuilder) => void) {
        this.#createOption(new ApplicationCommandMentionableOptionBuilder(), fn);
        return this;
    }

    public addNumberOption(fn: (builder: ApplicationCommandNumberOptionBuilder) => void) {
        this.#createOption(new ApplicationCommandNumberOptionBuilder(), fn);
        return this;
    }

    public addRoleOption(fn: (builder: ApplicationCommandRoleOptionBuilder) => void) {
        this.#createOption(new ApplicationCommandRoleOptionBuilder(), fn);
        return this;
    }

    public addStringOption(fn: (builder: ApplicationCommandStringOptionBuilder) => void) {
        this.#createOption(new ApplicationCommandStringOptionBuilder(), fn);
        return this;
    }

    public addUserOption(fn: (builder: ApplicationCommandUserOptionBuilder) => void) {
        this.#createOption(new ApplicationCommandUserOptionBuilder(), fn);
        return this;
    }

    public static from(data: Omit<APIApplicationCommandSubcommandOption, 'type'>) {
        return new ApplicationCommandSubcommandOptionBuilder(data);
    }

    #createOption(
        builder: AnyApplicationCommandOptionBuilder,
        fn: (builder: AnyApplicationCommandOptionBuilder) => void,
    ) {
        fn(builder);
        this.options.push(builder.toJSON() as APIApplicationCommandBasicOption);
    }
}
