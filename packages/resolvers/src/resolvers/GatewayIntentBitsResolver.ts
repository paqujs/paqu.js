import { GatewayIntentBits } from 'discord-api-types/v10';

export function GatewayIntentBitsResolver(intents: any): number | number[] {
    let res = intents;

    if (typeof intents === 'string') {
        res = GatewayIntentBits[intents] as number;
    } else if (Array.isArray(intents)) {
        res = intents.map((intent) =>
            typeof intent === 'string' ? GatewayIntentBits[intent] : intent
        ) as number[];
    }

    return res as number | number[];
}
