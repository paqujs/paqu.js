import {
    type GatewayThreadUpdateDispatch,
    type APIThreadChannel,
    ThreadChannel,
} from '../../../index';
import { BaseAction } from './BaseAction';

export class THREAD_UPDATE extends BaseAction {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayThreadUpdateDispatch) {
        const guild = this.handler.client.caches.guilds.cache.get((d as any).guild_id);

        if (guild) {
            let _thread = guild.caches.channels.cache.get(d.id) as ThreadChannel;

            if (_thread) {
                const thread = _thread;

                _thread = _thread._patch(d as APIThreadChannel);

                this.addChannelToEveryting(_thread, guild);
                this.handler.emit('threadUpdate', thread, _thread);
            }
        }
    }
}
