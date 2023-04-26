import { ThreadMemberFlags } from 'discord-api-types/v10';

export function ThreadMemberFlagsBitsResolver(flags: any): number | number[] {
    let res = flags;

    if (typeof flags === 'string') {
        res = ThreadMemberFlags[flags] as number;
    } else if (Array.isArray(flags)) {
        res = flags.map((flag) =>
            typeof flag === 'string' ? ThreadMemberFlags[flag] : flag,
        ) as number[];
    }

    return res as number | number[];
}
