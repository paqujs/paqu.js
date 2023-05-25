import { type GatewayMessageReactionRemoveEmojiDispatch, MessageReaction } from '../../../index';
import { BaseAction } from './BaseAction';

export class MESSAGE_REACTION_REMOVE_EMOJI extends BaseAction {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayMessageReactionRemoveEmojiDispatch) {
        this.handler.emit(
            'messageReactionRemoveEmoji',
            new MessageReaction(this.handler.client, d),
        );
    }
}
