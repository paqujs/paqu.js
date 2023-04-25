import { ApplicationFlags, type Arrayable } from '../index';

export type ApplicationFlagsBitsResolvable = Arrayable<keyof typeof ApplicationFlags | number>;

export function ApplicationFlagsBitsResolver(
    flags: ApplicationFlagsBitsResolvable,
): number | number[] {
    let res = flags;

    if (typeof flags === 'string') {
        res = ApplicationFlags[flags] as number;
    } else if (Array.isArray(flags)) {
        res = flags.map((flag) =>
            typeof flag === 'string' ? ApplicationFlags[flag] : flag,
        ) as number[];
    }

    return res as number | number[];
}
