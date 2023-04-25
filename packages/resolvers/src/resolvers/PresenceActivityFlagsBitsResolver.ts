import { ActivityFlags } from '../index';

export function PresenceActivityFlagsBitsResolver(flags: any): number | number[] {
    let res = flags;

    if (typeof flags === 'string') {
        res = ActivityFlags[flags as unknown as number] as unknown as number;
    } else if (Array.isArray(flags)) {
        res = flags.map((flag) =>
            typeof flag === 'string' ? ActivityFlags[flag as unknown as number] : flag,
        ) as number[];
    }

    return res as number | number[];
}
