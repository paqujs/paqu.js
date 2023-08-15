import { AttachmentFlags } from 'discord-api-types/v10';
import type { AttachmentFlagsBitsResolvable } from '@paqujs/bitfields';

export function AttachmentFlagsBitsResolver(flags: AttachmentFlagsBitsResolvable) {
    let res = flags;

    if (typeof flags === 'string') {
        res = AttachmentFlags[flags];
    } else if (Array.isArray(flags)) {
        res = flags.map((flag) => (typeof flag === 'string' ? AttachmentFlags[flag] : flag));
    }

    return res as AttachmentFlags | AttachmentFlags[];
}
