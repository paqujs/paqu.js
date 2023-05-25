import type { GatewayGuildScheduledEventUserAddDispatch } from '../../../index';
import { BaseAction } from './BaseAction';

export class GUILD_SCHEDULED_EVENT_USER_ADD extends BaseAction {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayGuildScheduledEventUserAddDispatch) {
        const guild = this.handler.client.caches.guilds.cache.get(d.guild_id)!;

        if (guild) {
            const scheduledEvent = guild.caches.scheduledEvents.cache.get(
                d.guild_scheduled_event_id,
            );
            const user = this.handler.client.caches.users.cache.get(d.user_id);

            if (scheduledEvent && user) {
                this.handler.emit('scheduledEventUserAdd', scheduledEvent, user);
            }
        }
    }
}
