import {
    type GatewayThreadCreateDispatch,
    type APIThreadChannel,
    ThreadChannel,
} from '../../../index';
import { BaseAction } from './BaseAction';

export class THREAD_CREATE extends BaseAction {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayThreadCreateDispatch) {
        const guild = this.handler.client.caches.guilds.cache.get((d as any).guild_id);

        if (guild) {
            this.handler.emit(
                'threadCreate',
                this.addChannelToEveryting(
                    new ThreadChannel(this.handler.client, guild, d as APIThreadChannel),
                    guild,
                ) as ThreadChannel,
            );
        }
    }
}
