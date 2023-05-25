import type { GatewayUserUpdateDispatch } from '../../../index';
import { BaseAction } from './BaseAction';

export class USER_UPDATE extends BaseAction {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayUserUpdateDispatch) {
        let _user = this.handler.client.caches.users.cache.get(d.id);

        if (_user) {
            const user = _user;

            _user = _user._patch(d);

            this.handler.client.caches.users.cache.set(user.id, _user);
            this.handler.emit('userUpdate', user, _user);
        }
    }
}
