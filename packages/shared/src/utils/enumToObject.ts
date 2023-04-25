export function enumToObject<T extends object>(e: T): Record<keyof T, string> {
    const obj = {} as Record<keyof T, string>;

    for (const key in e) {
        if (typeof e[key] === 'string') {
            obj[e[key as string]] = key;
        }
    }

    return obj;
}
