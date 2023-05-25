import { type GatewayStageInstanceCreateDispatch, StageInstance } from '../../../index';
import { BaseAction } from './BaseAction';

export class STAGE_INSTANCE_CREATE extends BaseAction {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayStageInstanceCreateDispatch) {
        const guild = this.handler.client.caches.guilds.cache.get(d.guild_id);

        if (guild) {
            this.handler.emit(
                'stageInstanceCreate',
                guild.caches.stageInstances.cache.setAndReturnValue(
                    d.id,
                    new StageInstance(this.handler.client, d),
                ),
            );
        }
    }
}
