import { GuildMemberFlags } from 'discord-api-types/v10';
import type { GuildMemberFlagsBitsResolvable } from '@paqujs/bitfields';

export function GuildMemberFlagsBitsResolver(flags: GuildMemberFlagsBitsResolvable) {
    let res = flags;

    if (typeof flags === 'string') {
        res = GuildMemberFlags[flags];
    } else if (Array.isArray(flags)) {
        res = flags.map((flag) => (typeof flag === 'string' ? GuildMemberFlags[flag] : flag));
    }

    return res as GuildMemberFlags | GuildMemberFlags[];
}
