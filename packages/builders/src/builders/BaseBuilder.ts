import { toJSON } from '@paqujs/shared';
import { deepStrictEqual } from 'assert';

export class BaseBuilder<T> {
    public set(key: string, value: any) {
        this[key] = value;
        return this;
    }

    public toJSON(): T {
        return toJSON(this, (_, value) =>
            typeof value === 'object' ? Object.keys(value).length > 0 : value !== undefined,
        ) as T;
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
