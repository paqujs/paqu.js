import { MessageFlags } from 'discord-api-types/v10';

export function MessageFlagsBitsResolver(flags: any): number | number[] {
    let res = flags;

    if (typeof flags === 'string') {
        res = MessageFlags[flags] as number;
    } else if (Array.isArray(flags)) {
        res = flags.map((flag) =>
            typeof flag === 'string' ? MessageFlags[flag] : flag
        ) as number[];
    }

    return res as number | number[];
}
