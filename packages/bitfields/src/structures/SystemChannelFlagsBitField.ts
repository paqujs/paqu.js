import { BitField } from '@paqujs/shared';
import { SystemChannelFlagsBitsResolver } from '@paqujs/resolvers';
import { GuildSystemChannelFlags } from 'discord-api-types/v10';
import { SystemChannelFlagsBitsResolvable } from '../index';

export interface SystemChannelFlagsBitField {
    toArray(): (keyof typeof GuildSystemChannelFlags)[];
}

export class SystemChannelFlagsBitField extends BitField {
    public static override Flags = GuildSystemChannelFlags;

    public override set(bits: SystemChannelFlagsBitsResolvable) {
        return super.set(SystemChannelFlagsBitsResolver(bits));
    }

    public override unset(bits: SystemChannelFlagsBitsResolvable) {
        return super.unset(SystemChannelFlagsBitsResolver(bits));
    }

    public override has(bits: SystemChannelFlagsBitsResolvable) {
        return super.has(SystemChannelFlagsBitsResolver(bits));
    }
}
