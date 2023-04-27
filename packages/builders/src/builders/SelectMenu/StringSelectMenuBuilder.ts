import {
    type APIStringSelectComponent,
    type APISelectMenuOption,
    ComponentType,
} from 'discord-api-types/v10';
import { EmojiResolver } from '@paqujs/resolvers';
import { BaseSelectMenuBuilder } from './BaseSelectMenuBuilder';

export interface SelectMenuOption {
    label: string;
    value: string;
    description?: string;
    emoji?: string;
    default?: boolean;
}

export class StringSelectMenuBuilder extends BaseSelectMenuBuilder<APIStringSelectComponent> {
    public options: APISelectMenuOption[];

    public constructor(data?: Omit<APIStringSelectComponent, 'type'>) {
        super({ ...data, type: ComponentType.StringSelect });

        this.options = data?.options ?? [];
    }

    public addOptions(...options: SelectMenuOption[]) {
        return this.set(
            'options',
            this.options.concat(
                options.map((option) => ({
                    ...option,
                    emoji: EmojiResolver(option.emoji),
                })) as APISelectMenuOption[],
            ),
        );
    }

    public static from(data: Omit<APIStringSelectComponent, 'type'>) {
        return new StringSelectMenuBuilder(data);
    }
}
