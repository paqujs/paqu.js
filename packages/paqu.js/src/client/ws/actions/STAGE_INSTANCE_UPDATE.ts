import type { GatewayStageInstanceUpdateDispatch } from '../../../index';
import { BaseAction } from './BaseAction';

export class STAGE_INSTANCE_UPDATE extends BaseAction {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayStageInstanceUpdateDispatch) {
        const guild = this.handler.client.caches.guilds.cache.get(d.guild_id);
        if (!guild) return;

        let _stageInstance = guild.caches.stageInstances.cache.get(d.id);

        if (_stageInstance) {
            const stageInstance = _stageInstance;
            _stageInstance = _stageInstance._patch(d);

            guild.caches.stageInstances.cache.set(d.id, _stageInstance);
            this.handler.emit('stageInstanceUpdate', stageInstance, _stageInstance);
        }
    }
}
