export class Collection<K, V> extends Map<K, V> {
    public find(fn: (value: V, key: K, collection: this) => boolean) {
        for (const [key, value] of this.entries()) {
            if (fn(value, key, this)) {
                return value;
            }
        }

        return undefined;
    }

    public findKey(fn: (value: V, key: K, collection: this) => boolean) {
        for (const [key, value] of this.entries()) {
            if (fn(value, key, this)) {
                return key;
            }
        }

        return undefined;
    }

    public filter(fn: (value: V, key: K, collection: this) => boolean) {
        const finded = new Collection<K, V>();

        for (const [key, value] of this.entries()) {
            if (fn(value, key, this)) {
                finded.set(key, value);
            }
        }

        return finded;
    }

    public map<T>(fn: (value: V, key: K, collection: this) => T) {
        const mapped = new Collection<K, T>();

        for (const [key, value] of this.entries()) {
            mapped.set(key, fn(value, key, this));
        }

        return mapped;
    }

    public some(fn: (value: V, key: K, collection: this) => boolean) {
        for (const [key, value] of this.entries()) {
            if (fn(value, key, this)) {
                return true;
            }
        }

        return false;
    }

    public every(fn: (value: V, key: K, collection: this) => boolean) {
        for (const [key, value] of this.entries()) {
            if (!fn(value, key, this)) {
                return false;
            }
        }

        return true;
    }

    public sort(
        fn: (firstValue: V, secondValue: V, firstKey: K, secondKey: K, collection: this) => number,
    ): Collection<K, V> {
        const entries = [...this.entries()];

        this.clear();

        entries.sort((a, b) => fn(a[1], b[1], a[0], b[0], this));

        for (const [key, value] of entries) {
            this.set(key, value);
        }

        return this;
    }

    public sorted(
        fn: (firstValue: V, secondValue: V, firstKey: K, secondKey: K, collection: this) => number,
    ) {
        return this.clone().sort(fn as any);
    }

    public reduce<T>(
        fn: (accumulator: T, value: V, key: K, collection: this) => V,
        initialValue?: T,
    ): T {
        let accumulator = initialValue;

        if (accumulator !== undefined) {
            for (const [key, value] of this.entries()) {
                accumulator = fn(accumulator, value, key, this) as unknown as T;
            }

            return accumulator;
        } else {
            let first = true;

            for (const [key, value] of this.entries()) {
                if (first) {
                    accumulator = fn(value as unknown as T, value, key, this) as unknown as T;
                    first = false;
                    break;
                }
            }

            return this.reduce(fn, accumulator);
        }
    }

    public intersect(other: Collection<K, V>) {
        return other.filter((_, key) => this.has(key));
    }

    public partition(fn: (value: V, key: K, collection: this) => boolean) {
        const result = [new Collection<K, V>(), new Collection<K, V>()];

        for (const [key, value] of this.entries()) {
            if (fn(value, key, this)) {
                result[0]!.set(key, value);
            } else {
                result[1]!.set(key, value);
            }
        }
    }

    public random(amount = 0): V | V[] | undefined {
        const values = this.array();

        if (amount === 0) {
            return values[Math.floor(Math.random() * this.size)];
        }

        return Array.from(
            { length: amount },
            (): V => values[Math.floor(Math.random() * this.size)],
        );
    }

    public randomKey(amount = 0): K | K[] | undefined {
        const keys = this.keyArray();

        if (amount === 0) {
            return keys[Math.floor(Math.random() * this.size)];
        }

        return Array.from({ length: amount }, (): K => keys[Math.floor(Math.random() * this.size)]);
    }

    public first(amount = 0): V | V[] | undefined {
        const iterable = this.values();

        if (amount === 0) {
            return iterable.next().value;
        }

        if (amount < 0) {
            return this.last(amount * -1);
        }

        amount = Math.min(this.size, amount);

        return Array.from({ length: amount }, (): V => iterable.next().value);
    }

    public firstKey(amount = 0): K | K[] | undefined {
        const iterable = this.keys();

        if (amount === 0) {
            return iterable.next().value;
        }

        if (amount < 0) {
            return this.lastKey(amount * -1);
        }

        amount = Math.min(this.size, amount);

        return Array.from({ length: amount }, (): K => iterable.next().value);
    }

    public last(amount = 0): V | V[] | undefined {
        const values = this.array();

        if (amount === 0) {
            return values[this.size - 1];
        }
        if (amount < 0) {
            return this.first(amount * -1);
        }

        amount = Math.min(this.size, amount);

        return values.slice(-amount);
    }

    public lastKey(amount = 0): K | K[] | undefined {
        const keys = this.keyArray();

        if (amount === 0) {
            return keys[this.size - 1];
        }
        if (amount < 0) {
            return this.firstKey(amount * -1);
        }

        amount = Math.min(this.size, amount);

        return keys.slice(-amount);
    }

    public concat(...collections: Collection<K, V>[]) {
        for (const collection of [this, ...collections]) {
            for (const [key, value] of collection.entries()) {
                this.set(key, value);
            }
        }

        return this;
    }

    public concated(...collections: Collection<K, V>[]) {
        const concated = new Collection<K, V>();

        for (const collection of [this, ...collections]) {
            for (const [key, value] of collection.entries()) {
                concated.set(key, value);
            }
        }

        return concated;
    }

    public array() {
        return [...this.values()];
    }

    public keyArray() {
        return [...this.keys()];
    }

    public clone() {
        return new Collection<K, V>(this);
    }

    public toJSON(): Record<string, V> {
        return Object.fromEntries(this.entries());
    }

    public setAndReturnValue(key: K, value: V) {
        this.set(key, value);
        return value;
    }
}
