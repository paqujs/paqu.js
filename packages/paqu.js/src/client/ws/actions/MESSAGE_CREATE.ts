import { type GatewayMessageCreateDispatch, Message } from '../../../index';
import { BaseAction } from './BaseAction';

export class MESSAGE_CREATE extends BaseAction {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayMessageCreateDispatch) {
        const message = new Message(this.handler.client, d);

        this.handler.emit('messageCreate', message);

        if (message.channel) {
            message.channel.caches.messages.cache.set(message.id, message);
        }
    }
}
