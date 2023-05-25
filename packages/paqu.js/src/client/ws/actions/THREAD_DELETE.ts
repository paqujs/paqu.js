import { type GatewayThreadDeleteDispatch, ThreadChannel } from '../../../index';
import { BaseAction } from './BaseAction';

export class THREAD_DELETE extends BaseAction {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayThreadDeleteDispatch) {
        const guild = this.handler.client.caches.guilds.cache.get((d as any).guild_id);

        if (guild) {
            const thread = guild.caches.channels.cache.get(d.id) as ThreadChannel;

            if (thread) {
                this.addChannelToEveryting(thread, guild);
                this.handler.emit('threadDelete', thread);
            }
        }
    }
}
