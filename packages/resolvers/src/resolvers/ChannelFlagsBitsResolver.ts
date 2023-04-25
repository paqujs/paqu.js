import { ChannelFlags } from '../index';

export function ChannelFlagsBitsResolver(flags: any): number | number[] {
    let res = flags;

    if (typeof flags === 'string') {
        res = ChannelFlags[flags] as number;
    } else if (Array.isArray(flags)) {
        res = flags.map((flag) =>
            typeof flag === 'string' ? ChannelFlags[flag] : flag,
        ) as number[];
    }

    return res as number | number[];
}
