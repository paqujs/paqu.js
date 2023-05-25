import type { Client, APIMessageComponentButtonInteraction } from '../../index';

import { BaseMessageComponentInteraction } from '../base/BaseMessageComponentInteraction';

export class ButtonInteraction extends BaseMessageComponentInteraction {
    public constructor(client: Client, data: APIMessageComponentButtonInteraction) {
        super(client, data);
    }
}
