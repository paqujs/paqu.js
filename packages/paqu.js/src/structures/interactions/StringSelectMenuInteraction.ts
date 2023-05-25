import type {
    Client,
    APIMessageComponentSelectMenuInteraction,
    APIMessageStringSelectInteractionData,
} from '../../index';

import { BaseMessageComponentInteraction } from '../base/BaseMessageComponentInteraction';

export class StringSelectMenuInteraction extends BaseMessageComponentInteraction {
    public values!: string[];

    public constructor(
        client: Client,
        data: APIMessageComponentSelectMenuInteraction & {
            data: APIMessageStringSelectInteractionData;
        },
    ) {
        super(client, data);

        this._patch(data);
    }

    public override _patch(
        data: APIMessageComponentSelectMenuInteraction & {
            data: APIMessageStringSelectInteractionData;
        },
    ) {
        super._patch(data);

        this.values = data.data.values;

        return this;
    }
}
