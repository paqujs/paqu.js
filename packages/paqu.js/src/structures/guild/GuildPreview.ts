import {
    type Client,
    type APIGuildPreview,
    type Snowflake,
    type ImageOptions,
    GuildEmoji,
    Sticker,
} from '../../index';
import { GuildFeature } from 'discord-api-types/v10';
import { Collection, enumToObject } from '@paqujs/shared';
import { BaseStructure } from '../base/BaseStructure';

export class GuildPreview extends BaseStructure {
    public id!: Snowflake;
    public name!: string;
    public icon!: string | null;
    public splash!: string | null;
    public discoverySplash!: string | null;
    public emojis!: Collection<Snowflake, GuildEmoji>;
    public features!: (keyof typeof GuildFeature)[];
    public approximateMemberCount!: number;
    public approximatePresenceCount!: number;
    public description!: string | null;
    public stickers!: Collection<Snowflake, Sticker>;

    public constructor(client: Client, data: APIGuildPreview) {
        super(client);

        this._patch(data);
    }

    public override _patch(data: APIGuildPreview) {
        this.id = data.id;
        this.name = data.name;
        this.icon = data.icon;
        this.splash = data.splash;
        this.discoverySplash = data.discovery_splash;
        this.features = data.features.map((feature) => enumToObject(GuildFeature)[feature]);
        this.approximateMemberCount = data.approximate_member_count;
        this.approximatePresenceCount = data.approximate_presence_count;
        this.description = data.description;

        this.emojis = new Collection();
        this.stickers = new Collection();

        for (const emoji of data.emojis) {
            this.emojis.set(emoji.id!, new GuildEmoji(this.client, this.guild!, emoji));
        }

        for (const sticker of data.stickers) {
            this.stickers.set(sticker.id, new Sticker(this.client, sticker));
        }

        return this;
    }

    public iconURL({ dynamic, size, format }: ImageOptions = { dynamic: true, size: 1024 }) {
        return this.icon
            ? `https://cdn.discordapp.com/icons/${this.id}/${this.icon}.${
                  dynamic && this.icon.startsWith('a_') ? 'gif' : format ?? 'png'
              }?size=${size ?? 1024}`
            : null;
    }

    public splashURL({ dynamic, size, format }: ImageOptions = { dynamic: true, size: 1024 }) {
        return this.splash
            ? `https://cdn.discordapp.com/splashes/${this.id}/${this.splash}.${
                  dynamic && this.splash.startsWith('a_') ? 'gif' : format ?? 'png'
              }?size=${size ?? 1024}`
            : null;
    }

    public discoverySplashURL(
        { dynamic, size, format }: ImageOptions = { dynamic: true, size: 1024 },
    ) {
        return this.discoverySplash
            ? `https://cdn.discordapp.com/discovery-splashes/${this.id}/${this.discoverySplash}.${
                  dynamic && this.discoverySplash.startsWith('a_') ? 'gif' : format ?? 'png'
              }?size=${size ?? 1024}`
            : null;
    }

    public get guild() {
        return this.client.caches.guilds.cache.get(this.id)!;
    }

    public async fetch() {
        return await this.client.caches.guilds.fetchPreview(this.id);
    }
}
