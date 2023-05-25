import { type GatewayGuildScheduledEventCreateDispatch, GuildScheduledEvent } from '../../../index';
import { BaseAction } from './BaseAction';

export class GUILD_SCHEDULED_EVENT_CREATE extends BaseAction {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayGuildScheduledEventCreateDispatch) {
        const guild = this.handler.client.caches.guilds.cache.get(d.guild_id);

        if (guild) {
            const scheduledEvent = new GuildScheduledEvent(this.handler.client, d);

            guild.caches.scheduledEvents.cache.set(scheduledEvent.id, scheduledEvent);

            this.handler.emit('scheduledEventCreate', scheduledEvent);
        }
    }
}
