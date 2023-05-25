import { type GatewayMessageReactionAddDispatch, MessageReaction } from '../../../index';
import { BaseAction } from './BaseAction';

export class MESSAGE_REACTION_ADD extends BaseAction {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayMessageReactionAddDispatch) {
        this.handler.emit('messageReactionAdd', new MessageReaction(this.handler.client, d));
    }
}
