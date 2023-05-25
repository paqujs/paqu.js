import { type GatewayGuildStickersUpdateDispatch, Sticker } from '../../../index';
import { BaseAction } from './BaseAction';

export class GUILD_STICKERS_UPDATE extends BaseAction {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayGuildStickersUpdateDispatch) {
        const guild = this.handler.client.caches.guilds.cache.get(d.guild_id)!;

        const deletions = new Set(guild.caches.stickers.cache.values());

        for (const sticker of d.stickers) {
            const _sticker = guild.caches.stickers.cache.get(sticker.id)!;

            if (_sticker) {
                deletions.delete(_sticker);
                const __sticker = new Sticker(this.handler.client, sticker);

                guild.caches.stickers.cache.set(__sticker.id, __sticker);
                this.handler.emit('stickerUpdate', _sticker, __sticker);
            } else {
                const __sticker = new Sticker(this.handler.client, sticker);

                guild.caches.stickers.cache.set(__sticker.id, __sticker);
                this.handler.emit('stickerCreate', __sticker);
            }
        }

        for (const sticker of deletions) {
            guild.caches.stickers.cache.delete(sticker.id);
            this.handler.emit('stickerDelete', sticker);
        }
    }
}
