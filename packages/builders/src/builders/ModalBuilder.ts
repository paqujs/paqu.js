import { APIModalInteractionResponseCallbackData } from 'discord-api-types/v10';
import { ActionRowBuilder, BaseBuilder } from '../index';

export class ModalBuilder extends BaseBuilder<APIModalInteractionResponseCallbackData> {
    public components: ActionRowBuilder[];
    public custom_id: string | null;
    public title: string | null;

    public constructor(data?: APIModalInteractionResponseCallbackData) {
        super();

        this.components = [];
        this.custom_id = data?.custom_id ?? null;
        this.title = data?.title ?? null;

        if (data?.components) {
            for (const component of data.components) {
                this.components.push(new ActionRowBuilder().addComponents(...component.components));
            }
        }
    }

    public addComponents(...components: ActionRowBuilder[]) {
        return this.set('components', this.components.concat(components));
    }

    public setCustomId(customId: string) {
        return this.set('custom_id', customId);
    }

    public setTitle(title: string): this {
        return this.set('title', title);
    }

    public static from(data: APIModalInteractionResponseCallbackData) {
        return new ModalBuilder(data);
    }
}
