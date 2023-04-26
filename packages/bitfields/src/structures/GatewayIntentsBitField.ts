import { BitField } from '@paqujs/shared';
import { GatewayIntentBitsResolver } from '@paqujs/resolvers';
import { GatewayIntentBits } from 'discord-api-types/v10';
import { GatewayIntentBitsResolvable } from '../index';

export interface GatewayIntentsBitField {
    toArray(): (keyof typeof GatewayIntentBits)[];
}

export class GatewayIntentsBitField extends BitField {
    public static override Flags = GatewayIntentBits;

    public override set(bits: GatewayIntentBitsResolvable) {
        return super.set(GatewayIntentBitsResolver(bits));
    }

    public override unset(bits: GatewayIntentBitsResolvable) {
        return super.unset(GatewayIntentBitsResolver(bits));
    }

    public override has(bits: GatewayIntentBitsResolvable) {
        return super.has(GatewayIntentBitsResolver(bits));
    }
}
