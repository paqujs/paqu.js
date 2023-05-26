import { toJSON } from '@paqujs/shared';
import deepEqual from 'fast-deep-equal';
import type { Client } from '../../index';

export abstract class BaseStructure {
    public client: Client;

    public constructor(client: Client) {
        this.client = client;
    }

    public abstract _patch(data: any): this;

    public toJSON() {
        return toJSON(this, (_, value) => value !== undefined);
    }

    public equals(other: this) {
        return deepEqual(this, other);
    }
}
