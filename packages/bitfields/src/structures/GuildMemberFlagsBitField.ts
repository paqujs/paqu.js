import { BitField } from '@paqujs/shared';
import { GuildMemberFlagsBitsResolver } from '@paqujs/resolvers';
import { GuildMemberFlagsBitsResolvable, GuildMemberFlags } from '../index';

export interface GuildMemberFlagsBitField {
    toArray(): (keyof typeof GuildMemberFlags)[];
}

export class GuildMemberFlagsBitField extends BitField {
    public static override Flags = GuildMemberFlags;

    public override set(bits: GuildMemberFlagsBitsResolvable) {
        return super.set(GuildMemberFlagsBitsResolver(bits));
    }

    public override unset(bits: GuildMemberFlagsBitsResolvable) {
        return super.unset(GuildMemberFlagsBitsResolver(bits));
    }

    public override has(bits: GuildMemberFlagsBitsResolvable) {
        return super.has(GuildMemberFlagsBitsResolver(bits));
    }
}
