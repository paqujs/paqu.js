import {
    type APIGuildIntegration,
    type Client,
    type APIIntegrationAccount,
    type Snowflake,
    GuildIntegrationApplication,
    GuildIntegrationType,
    SnowflakeUtil,
    User,
    Guild,
} from '../../index';
import { IntegrationExpireBehavior, OAuth2Scopes } from 'discord-api-types/v10';
import { BaseStructure } from '../base/BaseStructure';

export class GuildIntegration extends BaseStructure {
    public account!: APIIntegrationAccount;
    public application!: GuildIntegrationApplication | null;
    public enableEmoticons!: boolean;
    public enabled!: boolean;
    public expireBehavior!: keyof typeof IntegrationExpireBehavior;
    public expireGracePeriod!: number | null;
    public id!: Snowflake;
    public name!: string;
    public revoked!: boolean;
    public roleId!: Snowflake | null;
    public subscriberCount!: number;
    public syncedTimestamp!: number | null;
    public syncing!: boolean;
    public type!: keyof typeof GuildIntegrationType;
    public scopes!: (keyof typeof OAuth2Scopes)[];
    public user!: User | null;
    public guild!: Guild;

    public constructor(client: Client, guild: Guild, data: APIGuildIntegration) {
        super(client);

        this.guild = guild;

        this._patch(data);
    }

    public override _patch(data: APIGuildIntegration) {
        this.account = data.account;
        this.application = data.application
            ? new GuildIntegrationApplication(this.client, data.application)
            : null;
        this.enableEmoticons = data.enable_emoticons ?? false;
        this.enabled = data.enabled ?? false;
        this.expireBehavior = IntegrationExpireBehavior[
            data.expire_behavior ?? 0
        ] as keyof typeof IntegrationExpireBehavior;
        this.expireGracePeriod = data.expire_grace_period ?? null;
        this.id = data.id;
        this.name = data.name;
        this.revoked = data.revoked ?? false;
        this.roleId = data.role_id ?? null;
        this.subscriberCount = data.subscriber_count ?? 0;
        this.syncedTimestamp = data.synced_at ? new Date(data.synced_at).getTime() : null;
        this.syncing = data.syncing ?? false;
        this.user = data.user
            ? this.client.caches.users.cache.setAndReturnValue(
                  data.user?.id,
                  new User(this.client, data.user),
              )
            : null;
        this.type = GuildIntegrationType[data.type] as keyof typeof GuildIntegrationType;
        this.scopes = data.scopes ? data.scopes.map((scope) => OAuth2Scopes[scope]) : [];

        return this;
    }

    public get createdTimestamp() {
        return SnowflakeUtil.timestampFrom(this.id);
    }

    public get createdAt() {
        return new Date(this.createdTimestamp);
    }

    public get expireTimestamp() {
        return this.expireGracePeriod
            ? this.createdTimestamp + this.expireGracePeriod * 1000
            : null;
    }

    public get expireAt() {
        return this.expireTimestamp ? new Date(this.expireTimestamp) : null;
    }

    public get syncedAt() {
        return this.syncedTimestamp ? new Date(this.syncedTimestamp) : null;
    }

    public get role() {
        return this.roleId ? this.guild.caches.roles.cache.get(this.roleId) : null;
    }

    public delete(reason?: string) {
        return this.guild.caches.integrations.delete(this.id, reason);
    }

    public toString() {
        return this.name;
    }
}
