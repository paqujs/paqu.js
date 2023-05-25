import {
    type APIInvite,
    type Client,
    type Snowflake,
    type GatewayInviteCreateDispatchData,
    type FetchInviteOptions,
    User,
    InviteApplication,
    GuildScheduledEvent,
    InviteGuild,
    GuildBasedInvitableChannelResolvable,
} from '../../index';
import { InviteTargetType } from 'discord-api-types/v10';
import { BaseStructure } from '../base/BaseStructure';

export class Invite extends BaseStructure {
    public approximateMemberCount!: number | null;
    public approximatePresenceCount!: number | null;
    public channelId!: Snowflake | null;
    public code!: string;
    public expiresTimestamp!: number | null;
    public guildId!: Snowflake | null;
    public guild!: InviteGuild | null;
    public author!: User | null;
    public targetType!: keyof typeof InviteTargetType | null;
    public targetUser!: User | null;
    public createdTimestamp!: number | null;
    public uses!: number;
    public temporary!: boolean;
    public maximumAge!: number | null;
    public maximumUses!: number | null;
    public targetApplication!: InviteApplication | null;
    public guildScheduledEvent!: GuildScheduledEvent | null;

    public constructor(client: Client, data: GatewayInviteCreateDispatchData | APIInvite) {
        super(client);

        this._patch(data);
    }

    public _patch(data: GatewayInviteCreateDispatchData | APIInvite) {
        this.code = data.code;
        this.author = data.inviter
            ? this.client.caches.users.cache.setAndReturnValue(
                  data.inviter.id,
                  new User(this.client, data.inviter),
              )
            : null;
        this.targetType = data.target_type
            ? (InviteTargetType[data.target_type] as keyof typeof InviteTargetType)
            : null;
        this.targetUser = data.target_user
            ? this.client.caches.users.cache.setAndReturnValue(
                  data.target_user.id,
                  new User(this.client, data.target_user),
              )
            : null;

        if ('channel' in data) {
            this.channelId = data.channel?.id ?? null;
        } else {
            this.channelId ??= null;
        }

        if ('guild' in data) {
            this.guild = new InviteGuild(this.client, data.guild!);
        } else {
            this.guild ??= null;
        }

        if ('approximate_member_count' in data) {
            this.approximateMemberCount = data.approximate_member_count ?? null;
        } else {
            this.approximateMemberCount ??= null;
        }

        if ('approximate_presence_count' in data) {
            this.approximatePresenceCount = data.approximate_presence_count ?? null;
        } else {
            this.approximatePresenceCount ??= null;
        }

        if ('expires_at' in data) {
            this.expiresTimestamp = new Date(data.expires_at!).getTime() ?? null;
        } else {
            this.expiresTimestamp ??= null;
        }

        if ('guild_id' in data) {
            this.guildId = data.guild_id ?? null;
        } else {
            this.guildId ??= null;
        }

        if ('created_at' in data) {
            this.createdTimestamp = new Date(data.created_at!).getTime() ?? null;
        } else {
            this.createdTimestamp ??= null;
        }

        if ('uses' in data) {
            this.uses = data.uses;
        } else {
            this.uses ??= 0;
        }

        if ('temporary' in data) {
            this.temporary = data.temporary;
        } else {
            this.temporary ??= false;
        }

        if ('max_age' in data) {
            this.maximumAge = data.max_age;
        } else {
            this.maximumAge ??= null;
        }

        if ('max_uses' in data) {
            this.maximumUses = data.max_uses;
        } else {
            this.maximumUses ??= null;
        }

        if ('target_application' in data) {
            this.targetApplication = new InviteApplication(this.client, data.target_application);
        } else {
            this.targetApplication ??= null;
        }

        if ('guild_scheduled_event' in data) {
            this.guildScheduledEvent = data.guild_scheduled_event
                ? new GuildScheduledEvent(this.client, data.guild_scheduled_event)
                : null;
        } else {
            this.guildScheduledEvent ??= null;
        }

        return this;
    }

    public async delete(reason?: string) {
        await this.channel?.caches.invites.delete(this.code, reason);
        return;
    }

    public async fetch(options?: FetchInviteOptions) {
        return (await this.channel?.caches.invites.fetch(this.code, options)) as Invite | undefined;
    }

    public get channel() {
        return this.client!.caches.channels.cache.get(this.channelId!) as
            | GuildBasedInvitableChannelResolvable
            | undefined;
    }

    public get url() {
        return `https://discord.com/invite/${this.code}`;
    }

    public get expiresAt() {
        return new Date(this.expiresTimestamp!);
    }

    public get createdAt() {
        return new Date(this.createdTimestamp!);
    }

    public toString() {
        return this.url;
    }
}
