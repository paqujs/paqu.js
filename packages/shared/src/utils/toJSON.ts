export function toJSON<T extends object, K extends keyof T>(obj: T): Record<K, T[K]> {
    const props = Object.getOwnPropertyNames(obj);
    const json = {} as Record<K, T[K]>;

    for (const prop of props) {
        const value = obj[prop];

        if (value !== 'constructor' && !['function', 'object'].includes(typeof value)) {
            Object.defineProperty(json, prop, Object.getOwnPropertyDescriptor(obj, prop));
        } else if (value !== 'constructor' && typeof value === 'object') {
            json[prop as any] = toJSON(value);
        } else if (value !== 'constructor' && typeof value === 'function') {
            json[prop as any] = value.toString();
        }
    }

    return json;
}
