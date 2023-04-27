import { toJSON, isEqual } from '@paqujs/shared';

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
        return isEqual(this, other);
    }
}
