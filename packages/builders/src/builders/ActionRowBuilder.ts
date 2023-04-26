import {
    type APIButtonComponent,
    type APISelectMenuComponent,
    type APITextInputComponent,
    type APIActionRowComponent,
    type APIActionRowComponentTypes,
    ComponentType,
} from 'discord-api-types/v10';

import { BaseBuilder } from '../index';

export type APIAnyComponent =
    | APIButtonComponent
    | APISelectMenuComponent
    | APITextInputComponent
    | APIActionRowComponent<APIActionRowComponentTypes>;

export class ActionRowBuilder extends BaseBuilder<APIAnyComponent> {
    public type: 1 = ComponentType.ActionRow;
    public components: APIAnyComponent[];

    public constructor(components?: APIAnyComponent[]) {
        super();

        this.components = components ?? [];
    }

    public addComponents(...components: APIAnyComponent[]) {
        return this.set('components', this.components.concat(components));
    }
}
