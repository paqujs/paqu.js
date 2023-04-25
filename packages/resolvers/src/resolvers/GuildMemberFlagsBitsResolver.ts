import { GuildMemberFlags } from '../index';

export function GuildMemberFlagsBitsResolver(flags: any): number | number[] {
    let res = flags;

    if (typeof flags === 'string') {
        res = GuildMemberFlags[flags] as number;
    } else if (Array.isArray(flags)) {
        res = flags.map((flag) =>
            typeof flag === 'string' ? GuildMemberFlags[flag] : flag,
        ) as number[];
    }

    return res as number | number[];
}
