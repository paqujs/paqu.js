import { ActivityFlags } from 'discord-api-types/v10';
import type { PresenceActivityFlagsBitsResolvable } from '@paqujs/bitfields';

export function PresenceActivityFlagsBitsResolver(flags: PresenceActivityFlagsBitsResolvable) {
    let res = flags;

    if (typeof flags === 'string') {
        res = ActivityFlags[flags];
    } else if (Array.isArray(flags)) {
        res = flags.map((flag) => (typeof flag === 'string' ? ActivityFlags[flag] : flag));
    }

    return res as ActivityFlags | ActivityFlags[];
}
