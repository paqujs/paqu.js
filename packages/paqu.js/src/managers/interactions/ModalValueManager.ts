import type { Client, ModalSubmitComponentsData, ModalSubmitComponentData } from '../../index';

import { BaseManager } from '../base/BaseManager';

export class ModalValueManager extends BaseManager {
    public components!: ModalSubmitComponentData[];

    public constructor(client: Client, components: ModalSubmitComponentsData[]) {
        super(client);

        this.components = components.reduce((accumulator, component) => {
            return accumulator.concat(component.components);
        }, []);
    }

    public pick(customId: string): string | undefined {
        return this.components.find((component) => component.customId === customId)?.value;
    }

    public find(
        callbackfn: (
            customId: string,
            value: string,
            index: number,
            array: ModalSubmitComponentData[],
        ) => boolean,
    ): string | undefined {
        return this.components.find((c, i, arr) => {
            return callbackfn(c.customId, c.value, i, arr);
        })?.value;
    }

    public filter(
        callbackfn: (
            customId: string,
            value: string,
            index: number,
            array: ModalSubmitComponentData[],
        ) => boolean,
    ): string[] {
        return this.components
            .filter((c, i, arr) => {
                return callbackfn(c.customId, c.value, i, arr);
            })

            .map((c) => c.value) as string[];
    }
}
