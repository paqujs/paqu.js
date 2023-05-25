import type { GatewayPresenceUpdateDispatch } from '../../../index';
import { BaseAction } from './BaseAction';

export class PRESENCE_UPDATE extends BaseAction {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayPresenceUpdateDispatch) {
        let _presence = this.handler.client.caches.presences.get(d.user.id);

        if (_presence) {
            const presence = _presence;

            _presence = _presence._patch(d);

            this.handler.client.caches.presences.set(presence.user?.id!, _presence);
            this.handler.emit('presenceUpdate', presence, _presence);
        }
    }
}
