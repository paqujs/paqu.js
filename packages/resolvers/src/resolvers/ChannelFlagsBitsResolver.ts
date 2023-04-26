import { ChannelFlags } from 'discord-api-types/v10';
import type { ChannelFlagsBitsResolvable } from '@paqujs/bitfields';

export function ChannelFlagsBitsResolver(flags: ChannelFlagsBitsResolvable) {
    let res = flags;

    if (typeof flags === 'string') {
        res = ChannelFlags[flags];
    } else if (Array.isArray(flags)) {
        res = flags.map((flag) => (typeof flag === 'string' ? ChannelFlags[flag] : flag));
    }

    return res as ChannelFlags | ChannelFlags[];
}
