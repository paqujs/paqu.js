export function toJSON<T extends object, K extends keyof T>(
    obj: T,
    filter?: (key: K) => boolean,
): Record<K, T[K]> {
    const props = Object.getOwnPropertyNames(obj ?? {});
    const json = {} as Record<K, T[K]>;

    for (const prop of props) {
        const value = obj[prop];

        if (value !== 'constructor' && !['function', 'object'].includes(typeof value)) {
            Object.defineProperty(json, prop, Object.getOwnPropertyDescriptor(obj, prop));
        } else if (value !== 'constructor' && typeof value === 'object') {
            json[prop as any] = toJSON(value);
        }
    }

    if (typeof filter === 'function') {
        for (const prop of props) {
            if (!filter.call(json, prop)) {
                delete json[prop];
            }
        }
    }

    return json;
}
