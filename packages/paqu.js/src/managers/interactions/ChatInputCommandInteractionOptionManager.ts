import {
    type Client,
    type APIApplicationCommandInteractionDataOption,
    type APIInteractionDataResolved,
    type Guild,
    type ChatInputCommandResolvedOptionsData,
    type ChatInputCommandResolvedOptionData,
    type GuildMember,
    type InteractionDataResolvedChannel,
    type Role,
    type User,
    type Attachment,
    ChatInputCommandOptionsResolver,
} from '../../index';

import { BaseManager } from '../base/BaseManager';

export class ChatInputCommandInteractionOptionManager extends BaseManager {
    public guild: Guild | null;
    public options: ChatInputCommandResolvedOptionsData;

    public constructor(
        client: Client,
        options: APIApplicationCommandInteractionDataOption[],
        resolved: APIInteractionDataResolved,
        guild?: Guild,
    ) {
        super(client);

        this.guild = guild ?? null;
        this.options = ChatInputCommandOptionsResolver(this.client, this.guild, options, resolved);
    }

    public pick(name: string): ChatInputCommandResolvedOptionData | undefined {
        const subcommand = this.pickSubcommand();
        const subcommandGroup = this.pickSubcommandGroup();

        if (subcommand) {
            return this.options.options.get(subcommand)?.options?.get(name);
        }

        if (subcommandGroup) {
            return this.options.options
                .get(subcommandGroup)
                ?.options[subcommand]?.options?.get(name);
        }

        return this.options.options.get(name);
    }

    public pickSubcommand(): string | null {
        let subcommand: string | undefined;

        for (const option of this.options.options.values()) {
            if (option.type === 'Subcommand') {
                subcommand = option.name;
                break;
            }
        }

        return subcommand;
    }

    public pickSubcommandGroup() {
        let focusted: string | undefined;

        for (const option of this.options.options.values()) {
            if (option.type === 'SubcommandGroup') {
                for (const subcommand of option.options.values()) {
                    if (subcommand.type === 'Subcommand') {
                        focusted = subcommand.name;
                        break;
                    }
                }
                break;
            }
        }

        return focusted;
    }

    public pickString(name: string) {
        return this.pick(name)?.value as string | undefined;
    }

    public pickInteger(name: string) {
        return this.pick(name)?.value as number | undefined;
    }

    public pickBoolean(name: string) {
        return this.pick(name)?.value as boolean | undefined;
    }

    public pickChannel(name: string) {
        return this.pick(name)?.resolved?.channel!;
    }

    public pickMember(name: string): GuildMember | undefined {
        return this.pick(name)?.resolved?.member!;
    }

    public pickRole(name: string): Role | undefined {
        return this.pick(name)?.resolved?.role!;
    }

    public pickMentionable(
        name: string,
    ): GuildMember | Role | User | InteractionDataResolvedChannel | undefined {
        const picked = this.pick(name)?.resolved ?? {};

        return picked.user ?? picked.member ?? picked.role ?? picked.channel;
    }

    public pickUser(name: string): User | undefined {
        return this.pick(name)?.resolved?.user!;
    }

    public pickNumber(name: string): number | undefined {
        return this.pick(name)?.value as number;
    }

    public pickAttachment(name: string): Attachment | undefined {
        return this.pick(name)?.resolved?.attachment!;
    }
}
