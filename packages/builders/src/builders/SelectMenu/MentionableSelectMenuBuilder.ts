import { type APIMentionableSelectComponent, ComponentType } from 'discord-api-types/v10';
import { BaseSelectMenuBuilder } from './BaseSelectMenuBuilder';

export class MentionableSelectMenuBuilder extends BaseSelectMenuBuilder<APIMentionableSelectComponent> {
    public constructor(data?: Omit<APIMentionableSelectComponent, 'type'>) {
        super({ ...data, type: ComponentType.MentionableSelect });
    }

    public static from(data: Omit<APIMentionableSelectComponent, 'type'>) {
        return new MentionableSelectMenuBuilder(data);
    }
}
