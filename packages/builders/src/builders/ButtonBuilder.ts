import {
    type APIButtonComponent,
    type APIPartialEmoji,
    ComponentType,
    ButtonStyle,
} from 'discord-api-types/v10';
import { EmojiResolver } from '@paqujs/resolvers';
import { BaseBuilder } from '../index';

export type ButtonStyleResolvable = keyof typeof ButtonStyle | ButtonStyle;

export class ButtonBuilder extends BaseBuilder<APIButtonComponent> {
    public disabled: boolean;
    public emoji: APIPartialEmoji | null;
    public label: string | null;
    public custom_id: string | null;
    public style: number | null;
    public url: string | null;
    public type: 2 = ComponentType.Button;

    public constructor(data?: APIButtonComponent) {
        super();

        this.disabled = data?.disabled ?? false;
        this.emoji = (data?.emoji as APIPartialEmoji) ?? null;
        this.label = data?.label ?? null;

        if (data) {
            if ('custom_id' in data) {
                this.custom_id = data.custom_id;
            } else {
                this.custom_id = null;
            }

            if ('style' in data) {
                this.style = data.style;
            } else {
                this.style = null;
            }

            if ('url' in data) {
                this.url = data.url;
            } else {
                this.url = null;
            }
        } else {
            this.custom_id = null;
            this.style = null;
            this.url = null;
        }
    }

    public setDisabled(disabled: boolean) {
        return this.set('disabled', disabled);
    }

    public setEmoji(emoji: string) {
        return this.set('emoji', EmojiResolver(emoji));
    }

    public setLabel(label: string) {
        return this.set('label', label);
    }

    public setCustomId(customId: string) {
        return this.set('custom_id', customId);
    }

    public setStyle(style: ButtonStyleResolvable) {
        return this.set('style', typeof style === 'string' ? ButtonStyle[style] : style);
    }

    public setURL(url: string) {
        return this.set('url', url);
    }
}
