import { APISelectMenuComponent, ComponentType } from 'discord-api-types/v10';

import { BaseBuilder } from '../../index';

export interface SelectMenuComponentBase {
    disabled?: boolean;
    placeholder?: string;
    custom_id?: string;
    min_values?: number;
    max_values?: number;
    type?: ComponentType;
}

export class BaseSelectMenuBuilder<T = APISelectMenuComponent> extends BaseBuilder<T> {
    public disabled: boolean;
    public placeholder: string | null;
    public custom_id: string | null;
    public min_values: number;
    public max_values: number;
    public type: ComponentType;

    public constructor(data?: SelectMenuComponentBase) {
        super();

        this.disabled = data?.disabled ?? false;
        this.custom_id = data?.custom_id ?? null;
        this.placeholder = data?.placeholder ?? null;
        this.min_values = data?.min_values ?? 1;
        this.max_values = data?.max_values ?? 1;
        this.type = data?.type ?? ComponentType.StringSelect;
    }

    public setDisabled(disabled: boolean) {
        return this.set('disabled', disabled);
    }

    public setPlaceholder(placeholder: string) {
        return this.set('placeholder', placeholder);
    }

    public setCustomId(customId: string) {
        return this.set('custom_id', customId);
    }

    public setMinValues(minValues: number) {
        return this.set('min_values', minValues);
    }

    public setMaxValues(maxValues: number) {
        return this.set('max_values', maxValues);
    }

    public static from(data: SelectMenuComponentBase) {
        return new BaseSelectMenuBuilder(data);
    }
}
