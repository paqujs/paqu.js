import {
    type APIApplicationCommandSubcommandGroupOption,
    type APIApplicationCommandSubcommandOption,
    ApplicationCommandOptionType,
} from 'discord-api-types/v10';
import {
    ApplicationCommandSubcommandOptionBuilder,
    ApplicationCommandBaseOptionBuilder,
} from './index';

export class ApplicationCommandSubcommandGroupOptionBuilder extends ApplicationCommandBaseOptionBuilder<APIApplicationCommandSubcommandGroupOption> {
    public options!: APIApplicationCommandSubcommandOption[];

    public constructor(data?: Omit<APIApplicationCommandSubcommandGroupOption, 'type'>) {
        super({ ...data, type: ApplicationCommandOptionType.SubcommandGroup });

        this.options = data?.options ?? [];
    }

    public addSubcommand(fn: (builder: ApplicationCommandSubcommandOptionBuilder) => void) {
        const builder = new ApplicationCommandSubcommandOptionBuilder();

        fn(builder);
        this.options.push(builder.toJSON());

        return this;
    }
}
