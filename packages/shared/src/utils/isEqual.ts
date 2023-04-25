import { toJSON } from './toJSON';

export function isEqual<T extends object>(obj1: T, obj2: T): boolean {
    const props1 = toJSON(obj1);
    const props2 = toJSON(obj2);

    if (Object.keys(props1).length !== Object.keys(props2).length) {
        return false;
    }

    for (const prop in props1) {
        if (typeof props1[prop] === 'object') {
            if (!isEqual(props1[prop as any], props2[prop])) {
                return false;
            }
        } else if (props1[prop] !== props2[prop]) {
            return false;
        }
    }

    return true;
}
