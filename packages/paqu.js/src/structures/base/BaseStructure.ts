import { toJSON } from '@paqujs/shared';
import { deepStrictEqual } from 'assert';
import type { Client } from '../../index';

export abstract class BaseStructure {
    public client: Client;

    public constructor(client: Client) {
        this.client = client;
    }

    public abstract _patch(data: any): this;

    public toJSON() {
        return toJSON(this);
    }

    public equals(other: this) {
        let isEqual = true;

        try {
            deepStrictEqual(this, other);
        } catch {
            isEqual = false;
        }

        return isEqual;
    }
}
