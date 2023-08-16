import {
    type Client,
    type APIApplicationCommandAutocompleteInteraction,
    type APIApplicationCommandOptionChoice,
    ChatInputCommandInteractionOptionManager,
} from '../../index';
import { InteractionResponseType } from 'discord-api-types/v10';
import { BaseInteraction } from '../base/BaseInteraction';

export class AutocompleteInteraction extends BaseInteraction {
    public options!: ChatInputCommandInteractionOptionManager;

    public constructor(client: Client, data: APIApplicationCommandAutocompleteInteraction) {
        super(client, data);

        this._patch(data);
    }

    public override _patch(data: APIApplicationCommandAutocompleteInteraction) {
        super._patch(data);

        this.options = new ChatInputCommandInteractionOptionManager(
            this.client,
            data.data.options ?? [],
            data.data.resolved ?? {},
            this.guild,
        );

        return this;
    }

    public result(choices: APIApplicationCommandOptionChoice[]) {
        return this.client.rest.post<void>(
            `/interactions/${this.id}/${this.token}/callback`,
            {
                body: {
                    type: InteractionResponseType.ApplicationCommandAutocompleteResult,
                    choices,
                },
            },
        );
    }
}
