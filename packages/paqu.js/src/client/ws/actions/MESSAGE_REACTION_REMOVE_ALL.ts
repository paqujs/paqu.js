import type {
    GatewayMessageReactionRemoveAllDispatch,
    MessageableChannelResolvable,
} from '../../../index';
import { BaseAction } from './BaseAction';

export class MESSAGE_REACTION_REMOVE_ALL extends BaseAction {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayMessageReactionRemoveAllDispatch) {
        const channel = this.handler.client.caches.channels.cache.get(
            d.channel_id,
        ) as MessageableChannelResolvable;

        if (channel) {
            const message = channel.caches.messages.cache.get(d.message_id);

            if (message) {
                message.caches.reactions.cache.clear();
                this.handler.emit('messageReactionRemoveAll', message);
            }
        }
    }
}
