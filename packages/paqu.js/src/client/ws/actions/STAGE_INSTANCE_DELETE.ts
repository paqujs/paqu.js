import { type GatewayStageInstanceDeleteDispatch, StageInstance } from '../../../index';
import { BaseAction } from './BaseAction';

export class STAGE_INSTANCE_DELETE extends BaseAction {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayStageInstanceDeleteDispatch) {
        const guild = this.handler.client.caches.guilds.cache.get(d.guild_id);

        if (guild) {
            guild.caches.stageInstances.cache.delete(d.id);
        }

        this.handler.emit('stageInstanceDelete', new StageInstance(this.handler.client, d));
    }
}
