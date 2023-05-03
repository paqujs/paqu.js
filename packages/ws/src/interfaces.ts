import type { PresenceActivityFlagsBitsResolvable } from '@paqujs/bitfields';
import type {
    GatewayActivityEmoji,
    GatewayActivityParty,
    GatewayActivityAssets,
    GatewayActivitySecrets,
    GatewayActivityButton,
    GatewayPresenceClientStatus,
    GatewayActivityTimestamps,
    Snowflake,
    ActivityType,
    GatewayCloseCodes,
    GatewayReceivePayload,
} from 'discord-api-types/v10';

export type PresenceStatus = 'online' | 'idle' | 'dnd' | 'offline';

export interface PresenceData {
    activities?: PresenceActivityData[];
    status?: PresenceStatus;
    afk?: boolean;
    since?: number;
    client_status?: GatewayPresenceClientStatus;
}

export type PresenceActivityData = {
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
};

export type GatewayReceivePayloadWithShardId = GatewayReceivePayload & { shard_id: number };

export type PresenceActivityTypeResolvable = keyof typeof ActivityType | ActivityType;

export type GatewayCloseCodesResolvable = number | keyof typeof GatewayCloseCodes;
