import {
    type GatewayAutoModerationActionExecutionDispatch,
    AutoModerationActionException,
} from '../../../index';
import { BaseAction } from './BaseAction';

export class AUTO_MODERATION_ACTION_EXECUTION extends BaseAction {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayAutoModerationActionExecutionDispatch) {
        this.handler.emit(
            'autoModerationActionExecution',
            new AutoModerationActionException(this.handler.client, d),
        );
    }
}
