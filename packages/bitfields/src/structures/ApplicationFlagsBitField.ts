import { BitField } from '@paqujs/shared';
import { ApplicationFlagsBitsResolver } from '@paqujs/resolvers';
import { ApplicationFlags } from 'discord-api-types/v10';
import { ApplicationFlagsBitsResolvable } from '../index';

export interface ApplicationFlagsBitField {
    toArray(): (keyof typeof ApplicationFlags)[];
}

export class ApplicationFlagsBitField extends BitField {
    public static override Flags = ApplicationFlags;

    public override set(bits: ApplicationFlagsBitsResolvable) {
        return super.set(ApplicationFlagsBitsResolver(bits));
    }

    public override unset(bits: ApplicationFlagsBitsResolvable) {
        return super.unset(ApplicationFlagsBitsResolver(bits));
    }

    public override has(bits: ApplicationFlagsBitsResolvable) {
        return super.has(ApplicationFlagsBitsResolver(bits));
    }
}
