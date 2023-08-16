import {
    type Snowflake,
    type Client,
    type APIRole,
    type Guild,
    type FetchOptions,
    type EditAndCreateRoleData,
    type RoleTags,
    type ImageOptions,
    SnowflakeUtil,
} from '../../index';
import { HexDecimalToHex } from '@paqujs/resolvers';
import { PermissionFlagsBitField, RoleFlagsBitField } from '@paqujs/bitfields';

import { BaseStructure } from '../base/BaseStructure';

export class Role extends BaseStructure {
    public id!: Snowflake;
    public name!: string;
    public color!: number;
    public hoist!: boolean;
    public icon!: string | null;
    public unicodeEmoji!: string | null;
    public rawPosition!: number;
    public permissions!: PermissionFlagsBitField;
    public managed!: boolean;
    public mentionable!: boolean;
    public tags!: RoleTags;
    public flags!: RoleFlagsBitField;
    public guild: Guild;

    public constructor(client: Client, guild: Guild, data: APIRole) {
        super(client);

        this.guild = guild;
        this._patch(data);
    }

    public override _patch(data: APIRole) {
        this.id = data.id;
        this.name = data.name;
        this.color = data.color;
        this.hoist = data.hoist;
        this.icon = data.icon ?? null;
        this.unicodeEmoji = data.unicode_emoji ?? null;
        this.rawPosition = data.position;
        this.permissions = new PermissionFlagsBitField(+data.permissions);
        this.managed = data.managed;
        this.mentionable = data.mentionable;
        this.tags = data.tags
            ? {
                  botId: data.tags.bot_id ?? null,
                  integrationId: data.tags.integration_id ?? null,
                  premiumSubscriber: data.tags.premium_subscriber ?? null,
                  subscriptionListingId: data.tags.subscription_listing_id ?? null,
                  availableForPurchase: data.tags.available_for_purchase ?? null,
                  guildConnections: data.tags.guild_connections ?? null,
              }
            : {};
        this.flags = new RoleFlagsBitField(data.flags ?? 0);

        return this;
    }

    public permissionsIn(channelId: Snowflake) {
        const overwrites = this.guild.overwritesFor(channelId, this.id);

        if (!overwrites) {
            return new PermissionFlagsBitField(0);
        }

        const bitfield = new PermissionFlagsBitField(
            overwrites.allow ? overwrites.allow.bitset : 0,
        );

        bitfield.unset(overwrites.deny ? overwrites.deny.bitset : 0);

        return bitfield;
    }

    public permissionsFor(memberId: Snowflake) {
        const member = this.guild.caches.members.cache.get(memberId);

        if (!member) {
            return new PermissionFlagsBitField(0);
        } else {
            return member.permissions;
        }
    }

    public overwritesIn(id: Snowflake) {
        return this.guild.overwritesFor(id, this.id);
    }

    public get hexColor() {
        return HexDecimalToHex(this.color);
    }

    public get position() {
        return this.guild.caches.roles.cache.keyArray().indexOf(this.id);
    }

    public get createdTimestamp() {
        return SnowflakeUtil.timestampFrom(this.id!);
    }

    public fetch(options?: FetchOptions): Promise<Role> {
        return this.guild.caches.roles.fetch(this.id, options) as Promise<Role>;
    }

    public delete(reason?: string) {
        return this.guild.caches.roles.delete(this.id, reason);
    }

    public edit(data: EditAndCreateRoleData, reason?: string) {
        return this.guild.caches.roles.edit(this.id, data, reason);
    }

    public setPosition(position: number, reason?: string) {
        return this.guild.caches.roles.setPosition(this.id, position, reason);
    }

    public iconURL({ dynamic, size, format }: ImageOptions = { dynamic: true, size: 1024 }) {
        return this.icon
            ? `https://cdn.discordapp.com/role-icons/${this.id}/${this.icon}.${
                  dynamic && this.icon.startsWith('a_') ? 'gif' : format ?? 'png'
              }?size=${size ?? 1024}`
            : null;
    }

    public toString() {
        return `<@&${this.id}>`;
    }
}
