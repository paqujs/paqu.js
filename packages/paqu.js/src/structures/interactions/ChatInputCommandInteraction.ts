import {
    type Client,
    type APIChatInputApplicationCommandInteraction,
    ChatInputCommandInteractionOptionManager,
} from '../../index';

import { BaseCommandInteraction } from '../base/BaseCommandInteraction';

export class ChatInputCommandInteraction extends BaseCommandInteraction {
    public options!: ChatInputCommandInteractionOptionManager;

    public constructor(client: Client, data: APIChatInputApplicationCommandInteraction) {
        super(client, data);

        this._patch(data);
    }

    public override _patch(data: APIChatInputApplicationCommandInteraction) {
        super._patch(data);

        this.options = new ChatInputCommandInteractionOptionManager(
            this.client,
            data.data.options ?? [],
            data.data.resolved ?? {},
            this.guild,
        );

        return this;
    }
}
