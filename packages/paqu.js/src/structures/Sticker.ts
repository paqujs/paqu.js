import {
    type APISticker,
    type Client,
    type Snowflake,
    type FetchOptions,
    type RESTPatchAPIGuildStickerJSONBody,
    User,
} from '../index';
import { StickerType, StickerFormatType } from 'discord-api-types/v10';
import { BaseStructure } from './base/BaseStructure';

export class Sticker extends BaseStructure {
    public id!: Snowflake;
    public packId!: Snowflake | null;
    public name!: string;
    public description!: string | null;
    public tags!: string;
    public type!: keyof typeof StickerType;
    public formatType!: keyof typeof StickerFormatType;
    public available!: boolean;
    public guildId!: Snowflake | null;
    public author!: User | null;
    public sortValue!: number | null;

    public constructor(client: Client, data: APISticker) {
        super(client);

        this._patch(data);
    }

    public override _patch(data: APISticker) {
        this.id = data.id;
        this.name = data.name;
        this.tags = data.tags;
        this.type = StickerType[data.type] as keyof typeof StickerType;
        this.formatType = StickerFormatType[data.format_type] as keyof typeof StickerFormatType;

        if ('pack_id' in data) {
            this.packId = data.pack_id;
        } else {
            this.packId ??= null;
        }

        if ('description' in data) {
            this.description = data.description;
        } else {
            this.description ??= null;
        }

        if ('available' in data) {
            this.available = data.available;
        } else {
            this.available ??= true;
        }

        if ('guild_id' in data) {
            this.guildId = data.guild_id;
        } else {
            this.guildId ??= null;
        }

        if ('sort_value' in data) {
            this.sortValue = data.sort_value;
        } else {
            this.sortValue ??= null;
        }

        if ('user' in data) {
            this.author = this.client.caches.users.cache.setAndReturnValue(
                data.user.id,
                new User(this.client, data.user),
            );
        } else {
            this.author ??= null;
        }

        return this;
    }

    public get guild() {
        return this.client.caches.guilds.cache.get(this.guildId!)!;
    }

    public edit(data: RESTPatchAPIGuildStickerJSONBody) {
        return this.guild?.caches.stickers.edit(this.id, data);
    }

    public fetch(options?: FetchOptions) {
        return this.guild?.caches.stickers.fetch(this.id, options) as unknown as Sticker;
    }

    public delete(reason?: string) {
        return this.guild?.caches.stickers.delete(this.id, reason);
    }

    public get url() {
        return `https://cdn.discordapp.com/stickers/${this.id}.${
            this.formatType === 'Lottie' ? 'json' : 'png'
        }`;
    }

    public toString() {
        return this.url;
    }
}
