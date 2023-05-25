import {
    type APIGuildMember,
    type Guild,
    type Client,
    type EditGuildMemberData,
    type Snowflake,
    type CreateBanOptions,
    type ImageOptions,
    type FetchMemberOptions,
    type GatewayGuildMemberAddDispatchData,
    type GatewayGuildMemberUpdateDispatchData,
    GuildMemberCacheManager,
    User,
} from '../../index';
import { PermissionFlagsBitField, GuildMemberFlagsBitField } from '@paqujs/bitfields';

import { BaseStructure } from '../base/BaseStructure';

export class GuildMember extends BaseStructure {
    public id!: Snowflake;
    public avatar!: string | null;
    public communicationDisabledUntilTimestamp!: number;
    public deaf!: boolean;
    public joinedAt!: Date;
    public mute!: boolean;
    public nick!: string | null;
    public pending!: boolean;
    public premiumSinceTimestamp!: number;
    public user!: User;
    public caches!: GuildMemberCacheManager;
    public guild: Guild;
    public rawRoles!: Snowflake[];
    public flags!: GuildMemberFlagsBitField;
    #permissions!: number | null;

    public constructor(
        client: Client,
        guild: Guild,
        data:
            | APIGuildMember
            | GatewayGuildMemberAddDispatchData
            | GatewayGuildMemberUpdateDispatchData,
    ) {
        super(client);

        this.guild = guild;

        this._patch(data);
    }

    public override _patch(
        data:
            | APIGuildMember
            | GatewayGuildMemberAddDispatchData
            | GatewayGuildMemberUpdateDispatchData,
    ) {
        this.joinedAt = new Date(data.joined_at);

        if ('avatar' in data) {
            this.avatar = data.avatar ?? null;
        } else {
            this.avatar ??= null;
        }

        if ('communication_disabled_until' in data) {
            this.communicationDisabledUntilTimestamp = data.communication_disabled_until
                ? new Date(data.communication_disabled_until).getTime()
                : 0;
        } else {
            this.communicationDisabledUntilTimestamp ??= 0;
        }

        if ('deaf' in data) {
            this.deaf = data.deaf ?? false;
        } else {
            this.deaf ??= false;
        }

        if ('mute' in data) {
            this.mute = data.mute ?? false;
        } else {
            this.mute ??= false;
        }

        if ('nick' in data) {
            this.nick = data.nick ?? null;
        } else {
            this.nick ??= null;
        }

        if ('pending' in data) {
            this.pending = data.pending ?? false;
        } else {
            this.pending ??= false;
        }

        if ('permissions' in data) {
            this.#permissions = data.permissions as number ?? null;
        } else {
            this.#permissions ??= null;
        }

        if ('premium_since' in data) {
            this.premiumSinceTimestamp = data.premium_since
                ? new Date(data.premium_since).getTime()
                : 0;
        } else {
            this.premiumSinceTimestamp ??= 0;
        }

        if ('user' in data) {
            if (data.user) {
                let _user = this.client.caches.users.cache.get(data.user.id);

                if (_user) {
                    _user = _user._patch(data.user);
                } else {
                    _user = this.client.caches.users.cache.setAndReturnValue(
                        data.user.id,
                        new User(this.client, data.user),
                    );
                }

                this.user = _user;
                this.id = _user.id;
            } else {
                this.user ??= this.client.caches.users.cache.get(this.id);
            }
        } else {
            this.user ??= this.client.caches.users.cache.get(this.id);
        }

        if ('flags' in data) {
            this.flags = new GuildMemberFlagsBitField(data.flags);
        } else {
            this.flags ??= new GuildMemberFlagsBitField(0);
        }

        this.rawRoles = data.roles;
        this.user ??= this.client.caches.users.cache.get(this.id);
        this.caches = new GuildMemberCacheManager(this.client, this.guild, this);

        return this;
    }

    public get voice() {
        return this.guild.caches.voiceStates.cache.get(this.id);
    }

    public get communicationDisabledUntilAt() {
        return new Date(this.communicationDisabledUntilTimestamp);
    }

    public get communicationDisabledUntilHasExpired() {
        return this.communicationDisabledUntilTimestamp < Date.now();
    }

    public get premiumSinceAt() {
        return new Date(this.premiumSinceTimestamp);
    }

    public get joinedTimestamp() {
        return this.joinedAt.getTime();
    }

    public async edit(data: EditGuildMemberData, reason?: string) {
        return await this.guild.caches.members.edit(this.id, data, reason);
    }

    public async fetch(options?: FetchMemberOptions) {
        return await this.guild.caches.members.fetch(this.id, options);
    }

    public async kick(reason?: string) {
        return await this.guild.caches.members.kick(this.id, reason);
    }

    public async ban(options?: CreateBanOptions) {
        return await this.guild.caches.bans.create(this.id, options);
    }

    public async unban(reason?: string) {
        return await this.guild.caches.bans.remove(this.id, reason);
    }

    public avatarURL({ dynamic, size, format }: ImageOptions = { dynamic: true, size: 1024 }) {
        return this.avatar
            ? `https://cdn.discordapp.com/guilds/${this.guild.id}/users/${this.id}/avatars/${
                  this.avatar
              }.${dynamic && this.avatar.startsWith('a_') ? 'gif' : format ?? 'png'}?size=${
                  size ?? 1024
              }`
            : null;
    }

    public get permissions() {
        const perms = this.#permissions;

        if (perms) {
            return new PermissionFlagsBitField(perms);
        } else {
            return this.caches.roles.permissions;
        }
    }

    public permissionsIn(id: Snowflake) {
        const channel = this.guild.caches.channels.cache.get(id);

        if (!channel) {
            return new PermissionFlagsBitField(0);
        } else {
            return channel.permissionsFor(id);
        }
    }

    public overwritesIn(id: Snowflake) {
        return this.guild.overwritesFor(id, this.id);
    }

    public toString() {
        return `<@${this.id}>`;
    }
}
