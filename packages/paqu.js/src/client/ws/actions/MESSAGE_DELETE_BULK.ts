import {
    type GatewayMessageDeleteBulkDispatch,
    type GuildTextBasedChannelResolvable,
    type Snowflake,
    Message,
} from '../../../index';
import { Collection } from '@paqujs/shared';
import { BaseAction } from './BaseAction';

export class MESSAGE_DELETE_BULK extends BaseAction {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayMessageDeleteBulkDispatch) {
        const guild = this.handler.client.caches.guilds.cache.get(d.guild_id!);

        if (guild) {
            const channel = guild.caches.channels.cache.get(
                d.channel_id,
            ) as GuildTextBasedChannelResolvable;

            if (channel) {
                const messages = new Collection<Snowflake, Message>();

                for (const id of d.ids) {
                    const message = channel.caches.messages.cache.get(id);

                    if (message) {
                        messages.set(id, message);
                    }

                    channel.caches.messages.cache.delete(id);
                }

                this.handler.emit('messageDeleteBulk', channel, messages);
            }
        }
    }
}
