import { ApplicationFlags } from 'discord-api-types/v10';
import type { ApplicationFlagsBitsResolvable } from '@paqujs/bitfields';

export function ApplicationFlagsBitsResolver(flags: ApplicationFlagsBitsResolvable) {
    let res = flags;

    if (typeof flags === 'string') {
        res = ApplicationFlags[flags];
    } else if (Array.isArray(flags)) {
        res = flags.map((flag) => (typeof flag === 'string' ? ApplicationFlags[flag] : flag));
    }

    return res as ApplicationFlags | ApplicationFlags[];
}
