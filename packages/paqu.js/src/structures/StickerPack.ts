import { type Client, type APIStickerPack, type Snowflake, Sticker, SnowflakeUtil } from '../index';
import { Collection } from '@paqujs/shared';
import { BaseStructure } from './base/BaseStructure';

export class StickerPack extends BaseStructure {
    public bannerAssetId!: Snowflake | null;
    public coverStickerId!: Snowflake | null;
    public description!: string;
    public id!: Snowflake;
    public name!: string;
    public skuId!: Snowflake;
    public stickers!: Collection<Snowflake, Sticker>;

    public constructor(client: Client, data: APIStickerPack) {
        super(client);

        this._patch(data);
    }

    public override _patch(data: APIStickerPack) {
        this.bannerAssetId = data.banner_asset_id ?? null;
        this.coverStickerId = data.cover_sticker_id ?? null;
        this.description = data.description;
        this.id = data.id;
        this.name = data.name;
        this.skuId = data.sku_id;

        this.stickers = new Collection();

        for (const sticker of data.stickers) {
            this.stickers.set(sticker.id, new Sticker(this.client, sticker));
        }

        return this;
    }

    get coverSticker() {
        return this.coverStickerId && this.stickers.get(this.coverStickerId);
    }

    get createdTimestamp() {
        return SnowflakeUtil.timestampFrom(this.id);
    }

    get createdAt() {
        return new Date(this.createdTimestamp);
    }

    public async fetch() {
        return (await this.client.caches.stickers.fetchPack(this.id)) as StickerPack;
    }

    public toString() {
        return this.name;
    }
}
