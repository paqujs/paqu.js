import { type APIRoleSelectComponent, ComponentType } from 'discord-api-types/v10';
import { BaseSelectMenuBuilder } from './BaseSelectMenuBuilder';

export class RoleSelectMenuBuilder extends BaseSelectMenuBuilder<APIRoleSelectComponent> {
    public constructor(data?: Omit<APIRoleSelectComponent, 'type'>) {
        super({ ...data, type: ComponentType.RoleSelect });
    }

    public static from(data: Omit<APIRoleSelectComponent, 'type'>) {
        return new RoleSelectMenuBuilder(data);
    }
}
