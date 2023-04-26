import { GatewayIntentBits } from 'discord-api-types/v10';
import type { GatewayIntentBitsResolvable } from '@paqujs/bitfields';

export function GatewayIntentBitsResolver(intents: GatewayIntentBitsResolvable) {
    let res = intents;

    if (typeof intents === 'string') {
        res = GatewayIntentBits[intents];
    } else if (Array.isArray(intents)) {
        res = intents.map((intent) =>
            typeof intent === 'string' ? GatewayIntentBits[intent] : intent,
        );
    }

    return res as GatewayIntentBits | GatewayIntentBits[];
}
