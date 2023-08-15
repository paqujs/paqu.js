import { BitField } from '@paqujs/shared';
import { AttachmentFlagsBitsResolver } from '@paqujs/resolvers';
import { AttachmentFlags } from 'discord-api-types/v10';
import { AttachmentFlagsBitsResolvable } from '../index';

export interface AttachmentFlagsBitField {
    toArray(): (keyof typeof AttachmentFlags)[];
}

export class AttachmentFlagsBitField extends BitField {
    public static override Flags = AttachmentFlags;

    public override set(bits: AttachmentFlagsBitsResolvable) {
        return super.set(AttachmentFlagsBitsResolver(bits));
    }

    public override unset(bits: AttachmentFlagsBitsResolvable) {
        return super.unset(AttachmentFlagsBitsResolver(bits));
    }

    public override has(bits: AttachmentFlagsBitsResolvable) {
        return super.has(AttachmentFlagsBitsResolver(bits));
    }
}
