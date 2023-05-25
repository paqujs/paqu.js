import type { Client, APIMessageComponentInteraction } from '../../index';
import { ComponentType } from 'discord-api-types/v10';
import { BaseInteraction } from '../base/BaseInteraction';

export class BaseMessageComponentInteraction extends BaseInteraction {
    public componentType!: keyof typeof ComponentType;
    public customId!: string;

    public constructor(client: Client, data: APIMessageComponentInteraction) {
        super(client, data);

        this._patch(data);
    }

    public override _patch(data: APIMessageComponentInteraction) {
        super._patch(data);

        this.componentType = ComponentType[data.data.component_type] as keyof typeof ComponentType;
        this.customId = data.data.custom_id;

        return this;
    }
}
