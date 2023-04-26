import { BitField } from '@paqujs/shared';
import { ChannelFlagsBitsResolver } from '@paqujs/resolvers';
import { ChannelFlags } from 'discord-api-types/v10';
import { ChannelFlagsBitsResolvable } from '../index';

export interface ChannelFlagsBitField {
    toArray(): (keyof typeof ChannelFlags)[];
}

export class ChannelFlagsBitField extends BitField {
    public static override Flags = ChannelFlags;

    public override set(bits: ChannelFlagsBitsResolvable) {
        return super.set(ChannelFlagsBitsResolver(bits));
    }

    public override unset(bits: ChannelFlagsBitsResolvable) {
        return super.unset(ChannelFlagsBitsResolver(bits));
    }

    public override has(bits: ChannelFlagsBitsResolvable) {
        return super.has(ChannelFlagsBitsResolver(bits));
    }
}
