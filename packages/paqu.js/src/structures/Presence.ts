import {
    type Client,
    type GatewayPresenceUpdate,
    type PresenceStatus,
    type Snowflake,
    type PresenceClientStatusData,
    PresenceActivity,
} from '../index';

import { BaseStructure } from './base/BaseStructure';

export class Presence extends BaseStructure {
    public status!: PresenceStatus;
    public guildId!: Snowflake;
    public userId!: Snowflake;
    public clientStatus!: PresenceClientStatusData;
    public activities!: PresenceActivity[];
    public constructor(client: Client, data: GatewayPresenceUpdate) {
        super(client);

        this._patch(data);
    }

    public override _patch(data: GatewayPresenceUpdate) {
        this.status = data.status as PresenceStatus;
        this.userId = data.user.id;
        this.activities = [];

        if ('guild_id' in data) {
            this.guildId = data.guild_id;
        }

        if (data.activities) {
            for (const activity of data.activities) {
                this.activities.push(new PresenceActivity(this.client, activity));
            }
        }

        if (data.client_status) {
            this.clientStatus = {};

            if (data.client_status.desktop) {
                this.clientStatus.desktop = data.client_status.desktop as PresenceStatus;
            }

            if (data.client_status.mobile) {
                this.clientStatus.mobile = data.client_status.mobile as PresenceStatus;
            }

            if (data.client_status.web) {
                this.clientStatus.web = data.client_status.web as PresenceStatus;
            }
        }

        return this;
    }

    public get guild() {
        return this.client.caches.guilds.cache.get(this.guildId);
    }

    public get user() {
        return this.client.caches.users.cache.get(this.userId);
    }
}
