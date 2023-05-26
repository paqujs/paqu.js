import { toJSON } from '@paqujs/shared';
import deepEqual from 'fast-deep-equal';

export class BaseBuilder<T> {
    public set(key: string, value: any) {
        this[key] = value;
        return this;
    }

    public toJSON(): T {
        return toJSON(this, (_, value) => value !== undefined) as T;
    }

    public equals(other: this) {
        return deepEqual(this, other);
    }
}
