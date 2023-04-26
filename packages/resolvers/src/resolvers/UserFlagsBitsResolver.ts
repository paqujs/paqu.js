import { UserFlags } from 'discord-api-types/v10';

export function UserFlagsBitsResolver(flags: any): number | number[] {
    let res = flags;

    if (typeof flags === 'string') {
        res = UserFlags[flags] as number;
    } else if (Array.isArray(flags)) {
        res = flags.map((flag) => (typeof flag === 'string' ? UserFlags[flag] : flag)) as number[];
    }

    return res as number | number[];
}
