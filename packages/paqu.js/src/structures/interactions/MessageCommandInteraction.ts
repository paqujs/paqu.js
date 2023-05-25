import type { Client, APIMessageApplicationCommandInteraction } from '../../index';

import { BaseContextMenuInteraction } from '../base/BaseContextMenuInteraction';

export class MessageCommandInteraction extends BaseContextMenuInteraction {
    public constructor(client: Client, data: APIMessageApplicationCommandInteraction) {
        super(client, data);

        this._patch(data);
    }

    public override _patch(data: APIMessageApplicationCommandInteraction) {
        super._patch(data);

        return this;
    }

    public get target() {
        return this.channel?.caches.messages.cache.get(this.targetId);
    }
}
