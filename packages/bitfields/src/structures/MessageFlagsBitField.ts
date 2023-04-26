import { BitField } from '@paqujs/shared';
import { MessageFlagsBitsResolver } from '@paqujs/resolvers';
import { MessageFlags } from 'discord-api-types/v10';
import { MessageFlagsBitsResolvable } from '../index';

export interface GuildMemberFlaMessageFlagsBitFieldgsBitField {
    toArray(): (keyof typeof MessageFlags)[];
}

export class MessageFlagsBitField extends BitField {
    public static override Flags = MessageFlags;

    public override set(bits: MessageFlagsBitsResolvable) {
        return super.set(MessageFlagsBitsResolver(bits));
    }

    public override unset(bits: MessageFlagsBitsResolvable) {
        return super.unset(MessageFlagsBitsResolver(bits));
    }

    public override has(bits: MessageFlagsBitsResolvable) {
        return super.has(MessageFlagsBitsResolver(bits));
    }
}
