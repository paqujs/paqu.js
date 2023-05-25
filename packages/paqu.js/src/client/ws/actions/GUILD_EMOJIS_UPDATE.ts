import { type GatewayGuildEmojisUpdateDispatch, GuildEmoji } from '../../../index';
import { BaseAction } from './BaseAction';

export class GUILD_EMOJIS_UPDATE extends BaseAction {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayGuildEmojisUpdateDispatch) {
        const guild = this.handler.client.caches.guilds.cache.get(d.guild_id)!;

        const deletions = new Set(guild.caches.emojis.cache.values());

        for (const emoji of d.emojis) {
            const _emoji = guild.caches.emojis.cache.get(emoji.id!)!;

            if (_emoji) {
                deletions.delete(_emoji);
                const __emoji = new GuildEmoji(this.handler.client, guild, emoji);

                guild.caches.emojis.cache.set(__emoji.id!, __emoji);
                this.handler.emit('emojiUpdate', _emoji, __emoji);
            } else {
                const __emoji = new GuildEmoji(this.handler.client, guild, emoji);

                guild.caches.emojis.cache.set(__emoji.id!, __emoji);
                this.handler.emit('emojiCreate', __emoji);
            }
        }

        for (const emoji of deletions) {
            guild.caches.emojis.cache.delete(emoji.id!);
            this.handler.emit('emojiDelete', emoji);
        }
    }
}
