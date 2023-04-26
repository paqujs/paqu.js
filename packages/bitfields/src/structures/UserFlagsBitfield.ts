import { BitField } from '@paqujs/shared';
import { UserFlagsBitsResolver } from '@paqujs/resolvers';
import { UserFlags } from 'discord-api-types/v10';
import { UserFlagsBitsResolvable } from '../index';

export interface UserFlagsBitField {
    toArray(): (keyof typeof UserFlags)[];
}

export class UserFlagsBitField extends BitField {
    public static override Flags = UserFlags;

    public override set(bits: UserFlagsBitsResolvable) {
        return super.set(UserFlagsBitsResolver(bits));
    }

    public override unset(bits: UserFlagsBitsResolvable) {
        return super.unset(UserFlagsBitsResolver(bits));
    }

    public override has(bits: UserFlagsBitsResolvable) {
        return super.has(UserFlagsBitsResolver(bits));
    }
}
