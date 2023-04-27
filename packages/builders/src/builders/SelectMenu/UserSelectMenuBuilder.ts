import { type APIUserSelectComponent, ComponentType } from 'discord-api-types/v10';
import { BaseSelectMenuBuilder } from './BaseSelectMenuBuilder';

export class UserSelectMenuBuilder extends BaseSelectMenuBuilder<APIUserSelectComponent> {
    public constructor(data?: Omit<APIUserSelectComponent, 'type'>) {
        super({ ...data, type: ComponentType.UserSelect });
    }

    public static from(data: Omit<APIUserSelectComponent, 'type'>) {
        return new UserSelectMenuBuilder(data);
    }
}
