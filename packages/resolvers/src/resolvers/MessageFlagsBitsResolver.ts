import { MessageFlags } from 'discord-api-types/v10';
import type { MessageFlagsBitsResolvable } from '@paqujs/bitfields';

export function MessageFlagsBitsResolver(flags: MessageFlagsBitsResolvable) {
    let res = flags;

    if (typeof flags === 'string') {
        res = MessageFlags[flags];
    } else if (Array.isArray(flags)) {
        res = flags.map((flag) => (typeof flag === 'string' ? MessageFlags[flag] : flag));
    }

    return res as MessageFlags | MessageFlags[];
}
