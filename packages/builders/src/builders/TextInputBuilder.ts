import { type APITextInputComponent, ComponentType, TextInputStyle } from 'discord-api-types/v10';
import { BaseBuilder } from '../index';

export type TextInputStyleResolvable = keyof typeof TextInputStyle | TextInputStyle;

export class TextInputBuilder extends BaseBuilder<APITextInputComponent> {
    public required: boolean;
    public placeholder: string | null;
    public custom_id: string | null;
    public max_length: number;
    public min_length: number;
    public value: string | null;
    public style: number;
    public label: string;
    public type: 4 = ComponentType.TextInput;

    public constructor(data?: APITextInputComponent) {
        super();

        this.required = data?.required ?? false;
        this.custom_id = data?.custom_id ?? null;
        this.placeholder = data?.placeholder ?? null;
        this.min_length = data?.min_length ?? 0;
        this.max_length = data?.max_length ?? 4000;
        this.value = data?.value ?? null;
        this.style = data?.style ?? TextInputStyle.Short;
        this.label = data?.label ?? '';
    }

    public setRequired(required: boolean) {
        return this.set('required', required);
    }

    public setPlaceholder(placeholder: string) {
        return this.set('placeholder', placeholder);
    }

    public setCustomId(customId: string) {
        return this.set('custom_id', customId);
    }

    public setMaxLength(maxLength: number) {
        return this.set('max_length', maxLength);
    }

    public setMinLength(minLength: number) {
        return this.set('min_length', minLength);
    }

    public setValue(value: string) {
        return this.set('value', value);
    }

    public setStyle(style: TextInputStyleResolvable) {
        return this.set('style', typeof style === 'string' ? TextInputStyle[style] : style);
    }

    public setLabel(label: string) {
        return this.set('label', label);
    }

    public static from(data: APITextInputComponent) {
        return new TextInputBuilder(data);
    }
}
