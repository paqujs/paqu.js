import type { GatewayGuildScheduledEventUpdateDispatch } from '../../../index';
import { BaseAction } from './BaseAction';

export class GUILD_SCHEDULED_EVENT_UPDATE extends BaseAction {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayGuildScheduledEventUpdateDispatch) {
        const guild = this.handler.client.caches.guilds.cache.get(d.guild_id)!;

        if (guild) {
            let _event = guild.caches.scheduledEvents.cache.get(d.id);

            if (_event) {
                const event = _event;

                _event = _event._patch(d);

                guild.caches.scheduledEvents.cache.set(event.id, _event);
                this.handler.emit('guildScheduledEventUpdate', event, _event);
            }
        }
    }
}
