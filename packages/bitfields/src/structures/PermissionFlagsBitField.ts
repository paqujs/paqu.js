import { BitField } from '@paqujs/shared';
import { PermissionFlagsBitsResolver } from '@paqujs/resolvers';
import { PermissionFlagsBits, PermissionFlagsBitsResolvable } from '../index';

export interface PermissionFlagsBitField {
    toArray(): (keyof typeof PermissionFlagsBits)[];
}

export class PermissionFlagsBitField extends BitField {
    public static override Flags = PermissionFlagsBits;

    public override set(bits: PermissionFlagsBitsResolvable) {
        return super.set(PermissionFlagsBitsResolver(bits));
    }

    public override unset(bits: PermissionFlagsBitsResolvable) {
        return super.unset(PermissionFlagsBitsResolver(bits));
    }

    public override has(bits: PermissionFlagsBitsResolvable) {
        return super.has(PermissionFlagsBitsResolver(bits));
    }
}
