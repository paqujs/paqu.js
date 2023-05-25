import type {
    GatewayActivity,
    Snowflake,
    PresenceActivityAssets,
    GatewayActivityButton,
    Client,
    GatewayActivityParty,
    PresenceActivitySecrets,
    GatewayActivityTimestamps,
} from '../index';
import { ActivityType, ActivityPlatform } from 'discord-api-types/v10';
import { PresenceActivityFlagsBitField } from '@paqujs/bitfields';
import { BaseStructure } from './base/BaseStructure';

export class PresenceActivity extends BaseStructure {
    public applicationId!: Snowflake | null;
    public assets!: PresenceActivityAssets | null;
    public buttons!: GatewayActivityButton[] | string[];
    public createdTimestamp!: number;
    public details!: string;
    public emojiId!: Snowflake | null;
    public flags!: PresenceActivityFlagsBitField;
    public id!: string;
    public instance!: boolean;
    public name!: string;
    public party!: GatewayActivityParty | null;
    public platform!: keyof typeof ActivityPlatform | null;
    public secrets!: PresenceActivitySecrets | null;
    public sessionId!: string | null;
    public state!: string | null;
    public syncId!: string | null;
    public timestamps!: GatewayActivityTimestamps | null;
    public type!: keyof typeof ActivityType;
    public url!: string | null;
    public constructor(client: Client, data: GatewayActivity) {
        super(client);

        this._patch(data);
    }

    public override _patch(data: GatewayActivity) {
        this.applicationId = data.application_id ?? null;
        this.assets = data.assets
            ? {
                  largeImage: data.assets.large_image ?? null,
                  largeText: data.assets.large_text ?? null,
                  smallImage: data.assets.small_image ?? null,
                  smallText: data.assets.small_text ?? null,
              }
            : null;
        this.buttons = data.buttons ?? [];
        this.createdTimestamp = data.created_at;
        this.details = data.details ?? '';
        this.emojiId = data.emoji ? data.emoji.id ?? null : null;
        this.flags = new PresenceActivityFlagsBitField(data.flags ?? 0);
        this.id = data.id;
        this.instance = data.instance ?? false;
        this.name = data.name;
        this.party = data.party ?? null;
        this.platform = data.platform
            ? (ActivityPlatform[
                  data.platform as keyof typeof ActivityPlatform
              ] as unknown as keyof typeof ActivityPlatform)
            : null;
        this.secrets = data.secrets ?? null;
        this.sessionId = data.session_id ?? null;
        this.state = data.state ?? null;
        this.syncId = data.sync_id ?? null;
        this.timestamps = data.timestamps ?? null;
        this.type = ActivityType[data.type] as keyof typeof ActivityType;
        this.url = data.url ?? null;

        return this;
    }

    public get createdAt() {
        return new Date(this.createdTimestamp);
    }

    public get emoji() {
        return this.client.caches.emojis.get(this.emojiId!);
    }
}
