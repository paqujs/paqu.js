import { BitField } from '@paqujs/shared';
import { ThreadMemberFlagsBitsResolver } from '@paqujs/resolvers';
import { ThreadMemberFlags, ThreadMemberFlagsBitsResolvable } from '../index';

export interface ThreadMemberFlagsBitField {
    toArray(): (keyof typeof ThreadMemberFlags)[];
}

export class ThreadMemberFlagsBitField extends BitField {
    public static override Flags = ThreadMemberFlags;

    public override set(bits: ThreadMemberFlagsBitsResolvable) {
        return super.set(ThreadMemberFlagsBitsResolver(bits));
    }

    public override unset(bits: ThreadMemberFlagsBitsResolvable) {
        return super.unset(ThreadMemberFlagsBitsResolver(bits));
    }

    public override has(bits: ThreadMemberFlagsBitsResolvable) {
        return super.has(ThreadMemberFlagsBitsResolver(bits));
    }
}
