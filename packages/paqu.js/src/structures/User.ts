import {
    type APIUser,
    type Client,
    type Snowflake,
    type ImageOptions,
    SnowflakeUtil,
    UserDMManager,
} from '../index';
import { UserPremiumType } from 'discord-api-types/v10';
import { UserFlagsBitField } from '@paqujs/bitfields';
import { BaseStructure } from './base/BaseStructure';

export class User extends BaseStructure {
    public id!: Snowflake;
    public username!: string;
    public discriminator!: string;
    public avatar!: string | null;
    public bot!: boolean;
    public system!: boolean;
    public mfaEnabled!: boolean;
    public banner!: string | null;
    public accentColor!: number | null;
    public locale!: string | null;
    public verified!: boolean;
    public email!: string | null;
    public flags!: UserFlagsBitField;
    public premiumType!: keyof typeof UserPremiumType;
    public publicFlags!: UserFlagsBitField;
    public dm!: UserDMManager;

    public constructor(client: Client, data: APIUser) {
        super(client);

        this._patch(data);
    }

    public override _patch(data: APIUser) {
        this.id = data.id;
        this.username = data.username;
        this.discriminator = data.discriminator;
        this.avatar = data.avatar;

        if ('bot' in data) {
            this.bot = data.bot;
        } else {
            this.bot ??= false;
        }

        if ('system' in data) {
            this.system = data.system;
        } else {
            this.system ??= false;
        }

        if ('mfa_enabled' in data) {
            this.mfaEnabled = data.mfa_enabled;
        } else {
            this.mfaEnabled ??= false;
        }

        if ('banner' in data) {
            this.banner = data.banner;
        } else {
            this.banner ??= null;
        }

        if ('accent_color' in data) {
            this.accentColor = data.accent_color;
        } else {
            this.accentColor ??= null;
        }

        if ('locale' in data) {
            this.locale = data.locale;
        } else {
            this.locale ??= null;
        }

        if ('verified' in data) {
            this.verified = data.verified;
        } else {
            this.verified ??= false;
        }

        if ('email' in data) {
            this.email = data.email;
        } else {
            this.email ??= null;
        }

        if ('flags' in data) {
            this.flags = new UserFlagsBitField(data.flags);
        } else {
            this.flags ??= new UserFlagsBitField(0);
        }

        if ('premium_type' in data) {
            this.premiumType = UserPremiumType[data.premium_type] as keyof typeof UserPremiumType;
        } else {
            this.premiumType ??= 'None';
        }

        if ('public_flags' in data) {
            this.publicFlags = new UserFlagsBitField(data.public_flags);
        } else {
            this.publicFlags ??= new UserFlagsBitField(0);
        }

        this.dm ??= new UserDMManager(this.client, this);

        return this;
    }

    public get tag(): string {
        return `${this.username}#${this.discriminator}`;
    }

    public get createdTimestamp() {
        return SnowflakeUtil.timestampFrom(this.id);
    }

    public get createdAt() {
        return new Date(this.createdTimestamp);
    }

    public get defaultAvatarURL() {
        return `https://cdn.discordapp.com/embed/avatars/${
            (this.discriminator as unknown as number) % 5
        }.png`;
    }

    public get presence() {
        return this.client.caches.presences.get(this.id);
    }

    public avatarURL({ dynamic, size, format }: ImageOptions = { dynamic: true, size: 1024 }) {
        return this.avatar
            ? `https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}.${
                  dynamic && this.avatar.startsWith('a_') ? 'gif' : format ?? 'png'
              }?size=${size ?? 1024}`
            : this.defaultAvatarURL;
    }

    public bannerURL({ dynamic, size, format }: ImageOptions = { dynamic: true, size: 1024 }) {
        return this.banner
            ? `https://cdn.discordapp.com/banners/${this.id}/${this.banner}.${
                  dynamic && this.banner.startsWith('a_') ? 'gif' : format ?? 'png'
              }?size=${size ?? 1024}`
            : null;
    }

    public async fetch(): Promise<User> {
        return (await this.client.caches.users.fetch(this.id)) as unknown as User;
    }

    public toString() {
        return `<@${this.id}>`;
    }
}
