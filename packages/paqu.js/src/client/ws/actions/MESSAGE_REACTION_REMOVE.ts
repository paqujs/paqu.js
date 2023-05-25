import {
    type GatewayMessageReactionRemoveDispatch,
    type MessageableChannelResolvable,
    MessageReaction,
} from '../../../index';
import { BaseAction } from './BaseAction';

export class MESSAGE_REACTION_REMOVE extends BaseAction {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayMessageReactionRemoveDispatch) {
        const channel = this.handler.client.caches.channels.cache.get(
            d.channel_id,
        ) as MessageableChannelResolvable;

        if (channel) {
            const message = channel?.caches.messages.cache.get(d.message_id);

            if (message) {
                message.caches.reactions.cache.delete(d.emoji.id!);
            }
        }

        this.handler.emit('messageReactionRemove', new MessageReaction(this.handler.client, d));
    }
}
