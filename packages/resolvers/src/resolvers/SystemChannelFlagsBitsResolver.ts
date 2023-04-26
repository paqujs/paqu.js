import { GuildSystemChannelFlags } from 'discord-api-types/v10';
import type { SystemChannelFlagsBitsResolvable } from '@paqujs/bitfields';

export function SystemChannelFlagsBitsResolver(flags: SystemChannelFlagsBitsResolvable) {
    let res = flags;

    if (typeof flags === 'string') {
        res = GuildSystemChannelFlags[flags];
    } else if (Array.isArray(flags)) {
        res = flags.map((flag) =>
            typeof flag === 'string' ? GuildSystemChannelFlags[flag] : flag,
        );
    }

    return res as GuildSystemChannelFlags | GuildSystemChannelFlags[];
}
