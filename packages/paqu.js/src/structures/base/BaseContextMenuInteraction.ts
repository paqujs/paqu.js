import type { Client, APIContextMenuInteraction, Snowflake } from '../../index';

import { BaseCommandInteraction } from './BaseCommandInteraction';

export class BaseContextMenuInteraction extends BaseCommandInteraction {
    public targetId!: Snowflake;

    public constructor(client: Client, data: APIContextMenuInteraction) {
        super(client, data);

        this._patch(data);
    }

    public override _patch(data: APIContextMenuInteraction) {
        super._patch(data);

        this.targetId = data.data.target_id;

        return this;
    }
}
