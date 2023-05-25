import { type GatewayTypingStartDispatch, Typing } from '../../../index';
import { BaseAction } from './BaseAction';

export class TYPING_START extends BaseAction {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayTypingStartDispatch) {
        this.handler.emit('typingStart', new Typing(this.handler.client, d));
    }
}
