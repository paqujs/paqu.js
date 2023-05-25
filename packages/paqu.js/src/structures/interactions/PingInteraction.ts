import type { Client, APIPingInteraction } from '../../index';

import { BaseInteraction } from '../base/BaseInteraction';

export class PingInteraction extends BaseInteraction {
    public constructor(client: Client, data: APIPingInteraction) {
        super(client, data);

        this._patch(data);
    }
}
