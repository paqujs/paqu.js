import { BitField } from '@paqujs/shared';
import { RoleFlagsBitsResolver } from '@paqujs/resolvers';
import { RoleFlags } from 'discord-api-types/v10';
import { RoleFlagsBitsResolvable } from '../index';

export interface RoleFlagsBitField {
    toArray(): (keyof typeof RoleFlags)[];
}

export class UserFlagsBitField extends BitField {
    public static override Flags = RoleFlags;

    public override set(bits: RoleFlagsBitsResolvable) {
        return super.set(RoleFlagsBitsResolver(bits));
    }

    public override unset(bits: RoleFlagsBitsResolvable) {
        return super.unset(RoleFlagsBitsResolver(bits));
    }

    public override has(bits: RoleFlagsBitsResolvable) {
        return super.has(RoleFlagsBitsResolver(bits));
    }
}
