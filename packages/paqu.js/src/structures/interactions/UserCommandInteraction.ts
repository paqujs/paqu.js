import type { Client, APIUserApplicationCommandInteraction } from '../../index';

import { BaseContextMenuInteraction } from '../base/BaseContextMenuInteraction';

export class UserCommandInteraction extends BaseContextMenuInteraction {
    public constructor(client: Client, data: APIUserApplicationCommandInteraction) {
        super(client, data);

        this._patch(data);
    }

    public override _patch(data: APIUserApplicationCommandInteraction) {
        super._patch(data);

        return this;
    }

    public get target() {
        return this.client.caches.users.cache.get(this.targetId);
    }

    public get targetMember() {
        return this.guild?.caches.members.cache.get(this.targetId);
    }
}
