import { Arrayable } from '@paqujs/shared';
import {
    GatewayActivityEmoji,
    GatewayActivityParty,
    GatewayActivityAssets,
    GatewayActivitySecrets,
    GatewayActivityButton,
    GatewayPresenceClientStatus,
    GatewayActivityTimestamps,
    GatewayIntentBits,
    Snowflake,
    ActivityFlags,
    ActivityType,
    GatewayCloseCodes,
} from 'discord-api-types/v10';

export type PresenceStatus = 'online' | 'idle' | 'dnd' | 'offline';

export interface PresenceData {
    activities?: PresenceActivity[];
    status?: PresenceStatus;
    afk?: boolean;
    since?: number;
    client_status?: GatewayPresenceClientStatus;
}

export interface PresenceActivity {
    name: string;
    type?: PresenceActivityTypeResolvable;
    url?: string;
    created_at?: number;
    timestamps?: GatewayActivityTimestamps[];
    application_id?: Snowflake;
    details?: string;
    state?: string;
    emoji?: GatewayActivityEmoji[];
    party?: GatewayActivityParty[];
    assets?: GatewayActivityAssets[];
    secrets?: GatewayActivitySecrets[];
    instance?: boolean;
    flags?: PresenceActivityFlagsBitsResolvable;
    buttons?: GatewayActivityButton[];
}

export interface PresenceActivitySecrets {
    join?: string;
    spectate?: string;
    match?: string;
}

export interface PresenceActivityAssets {
    largeImage: string | null;
    largeText: string | null;
    smallImage: string | null;
    smallText: string | null;
}

export type GatewayIntentBitsResolvable = Arrayable<keyof typeof GatewayIntentBits | number>;

export type PresenceActivityFlagsBitsResolvable = Arrayable<keyof typeof ActivityFlags | number>;

export type PresenceActivityTypeResolvable = keyof typeof ActivityType | number;

export type GatewayCloseCodesResolvable = number | keyof typeof GatewayCloseCodes;
