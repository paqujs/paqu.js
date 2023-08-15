import { BitField } from '@paqujs/shared';
import { UserFlagsBitsResolver } from '@paqujs/resolvers';
import { AttachmentFlags } from 'discord-api-types/v10';
import { AttachmentFlagsBitsResolvable } from '../index';

export interface AttachmentFlagsBitField {
    toArray(): (keyof typeof AttachmentFlags)[];
}

export class AttachmentFlagsBitField extends BitField {
    public static override Flags = AttachmentFlags;

    public override set(bits: AttachmentFlagsBitsResolvable) {
        return super.set(UserFlagsBitsResolver(bits as any));
    }

    public override unset(bits: AttachmentFlagsBitsResolvable) {
        return super.unset(UserFlagsBitsResolver(bits as any));
    }

    public override has(bits: AttachmentFlagsBitsResolvable) {
        return super.has(UserFlagsBitsResolver(bits as any));
    }
}
