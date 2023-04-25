import { BitField } from '@paqujs/shared';
import { PresenceActivityFlagsBitsResolver } from '@paqujs/resolvers';
import { ActivityFlags, PresenceActivityFlagsBitsResolvable } from '../index';

export interface PresenceActivityFlagsBitField {
    toArray(): (keyof typeof ActivityFlags)[];
}

export class PresenceActivityFlagsBitField extends BitField {
    public static override Flags = ActivityFlags;

    public override set(bits: PresenceActivityFlagsBitsResolvable) {
        return super.set(PresenceActivityFlagsBitsResolver(bits));
    }

    public override unset(bits: PresenceActivityFlagsBitsResolvable) {
        return super.unset(PresenceActivityFlagsBitsResolver(bits));
    }

    public override has(bits: PresenceActivityFlagsBitsResolvable) {
        return super.has(PresenceActivityFlagsBitsResolver(bits));
    }
}
