import { RoleFlags } from 'discord-api-types/v10';
import type { RoleFlagsBitsResolvable } from '@paqujs/bitfields';

export function RoleFlagsBitsResolver(flags: RoleFlagsBitsResolvable) {
    let res = flags;

    if (typeof flags === 'string') {
        res = RoleFlags[flags];
    } else if (Array.isArray(flags)) {
        res = flags.map((flag) => (typeof flag === 'string' ? RoleFlags[flag] : flag));
    }

    return res as RoleFlags | RoleFlags[];
}
