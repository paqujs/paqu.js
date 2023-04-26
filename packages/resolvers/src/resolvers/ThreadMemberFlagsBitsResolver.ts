import { ThreadMemberFlags } from 'discord-api-types/v10';
import type { ThreadMemberFlagsBitsResolvable } from '@paqujs/bitfields';

export function ThreadMemberFlagsBitsResolver(flags: ThreadMemberFlagsBitsResolvable) {
    let res = flags;

    if (typeof flags === 'string') {
        res = ThreadMemberFlags[flags];
    } else if (Array.isArray(flags)) {
        res = flags.map((flag) => (typeof flag === 'string' ? ThreadMemberFlags[flag] : flag));
    }

    return res as ThreadMemberFlags | ThreadMemberFlags[];
}
