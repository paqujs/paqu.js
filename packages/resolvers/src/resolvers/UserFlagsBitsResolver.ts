import { UserFlags } from 'discord-api-types/v10';
import type { UserFlagsBitsResolvable } from '@paqujs/bitfields';

export function UserFlagsBitsResolver(flags: UserFlagsBitsResolvable) {
    let res = flags;

    if (typeof flags === 'string') {
        res = UserFlags[flags];
    } else if (Array.isArray(flags)) {
        res = flags.map((flag) => (typeof flag === 'string' ? UserFlags[flag] : flag));
    }

    return res as UserFlags | UserFlags[];
}
