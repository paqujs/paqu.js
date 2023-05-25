import {
    Sticker,
    type Client,
    type Collectionable,
    type Snowflake,
    type APIStickerPack,
    StickerPack,
} from '../../index';
import { Collection } from '@paqujs/shared';
import { BaseManager } from '../base/BaseManager';

export class ClientStickerManager extends BaseManager {
    public constructor(client: Client) {
        super(client);
    }

    public get cache() {
        return this.client.caches.guilds.cache.reduce(
            (accumulator, guild) => (accumulator as any).concat(guild.caches.stickers.cache),
            new Collection<Snowflake, Sticker>(),
        );
    }

    public async fetchPack(id?: Snowflake): Promise<Collectionable<Snowflake, StickerPack>> {
        const packs = await this.client.rest.get<APIStickerPack[]>(`/sticker-packs`);
        const collection = new Collection<Snowflake, StickerPack>();

        for (const pack of packs) {
            collection.set(pack.id, new StickerPack(this.client, pack));
        }

        if (id) {
            return collection.get(id)!;
        }

        return collection;
    }
}
