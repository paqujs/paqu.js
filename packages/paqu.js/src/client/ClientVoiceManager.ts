import { type Snowflake, type Client } from '../index';
import { BaseManager } from '../managers/base/BaseManager';

export class ClientVoiceManager extends BaseManager {
    public adapters = new Map<Snowflake, Record<string, any>>();

    public constructor(client: Client) {
        super(client);

        this.client.ws.on('shardClosed', (shard) => {
            for (const [guildId, adapter] of this.adapters.entries()) {
                if (client.caches.guilds.cache.get(guildId)?.shardId === shard.id) {
                    adapter.destroy();
                }
            }
        });
    }
}
