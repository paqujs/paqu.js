import {
    type GatewayInteractionCreateDispatch,
    type APIMessageComponentButtonInteraction,
    type APIChatInputApplicationCommandInteraction,
    type APIUserApplicationCommandInteraction,
    type APIMessageApplicationCommandInteraction,
    type AnyInteraction,
    AutocompleteInteraction,
    ButtonInteraction,
    ChatInputCommandInteraction,
    UserCommandInteraction,
    MessageCommandInteraction,
    ModalSubmitInteraction,
    ChannelSelectMenuInteraction,
    MentionableSelectMenuInteraction,
    PingInteraction,
    RoleSelectMenuInteraction,
    UserSelectMenuInteraction,
    StringSelectMenuInteraction,
} from '../../../index';
import { InteractionType, ComponentType, ApplicationCommandType } from 'discord-api-types/v10';
import { BaseAction } from './BaseAction';

export class INTERACTION_CREATE extends BaseAction {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayInteractionCreateDispatch) {
        const client = this.handler.client;

        let interaction: AnyInteraction | null = null;

        switch (d.type) {
            case InteractionType.ApplicationCommand:
                switch (d.data.type) {
                    case ApplicationCommandType.ChatInput:
                        interaction = new ChatInputCommandInteraction(
                            client,
                            d as APIChatInputApplicationCommandInteraction,
                        );
                        break;
                    case ApplicationCommandType.User:
                        interaction = new UserCommandInteraction(
                            client,
                            d as APIUserApplicationCommandInteraction,
                        );
                        break;
                    case ApplicationCommandType.Message:
                        interaction = new MessageCommandInteraction(
                            client,
                            d as APIMessageApplicationCommandInteraction,
                        );
                        break;
                }
                break;
            case InteractionType.MessageComponent:
                switch (d.data.component_type) {
                    case ComponentType.Button:
                        interaction = new ButtonInteraction(
                            client,
                            d as APIMessageComponentButtonInteraction,
                        );
                        break;
                    case ComponentType.ChannelSelect:
                        interaction = new ChannelSelectMenuInteraction(client, d as any);
                        break;
                    case ComponentType.MentionableSelect:
                        interaction = new MentionableSelectMenuInteraction(client, d as any);
                        break;
                    case ComponentType.RoleSelect:
                        interaction = new RoleSelectMenuInteraction(client, d as any);
                        break;
                    case ComponentType.UserSelect:
                        interaction = new UserSelectMenuInteraction(client, d as any);
                        break;
                    case ComponentType.StringSelect:
                        interaction = new StringSelectMenuInteraction(client, d as any);
                        break;
                }
                break;
            case InteractionType.ModalSubmit:
                interaction = new ModalSubmitInteraction(client, d);
                break;
            case InteractionType.ApplicationCommandAutocomplete:
                interaction = new AutocompleteInteraction(client, d);
                break;
            case InteractionType.Ping:
                interaction = new PingInteraction(client, d);
                break;
        }

        if (interaction) {
            this.handler.emit('interactionCreate', interaction);
        }
    }
}
