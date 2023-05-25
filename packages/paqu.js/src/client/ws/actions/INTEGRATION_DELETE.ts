import type { GatewayIntegrationDeleteDispatch } from '../../../index';
import { BaseAction } from './BaseAction';

export class INTEGRATION_DELETE extends BaseAction {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayIntegrationDeleteDispatch) {
        const guild = this.handler.client.caches.guilds.cache.get(d.guild_id);
        if (!guild) return;

        const integration = guild.caches.integrations.cache.get(d.id);

        if (integration) {
            guild.caches.integrations.cache.delete(d.id);
            this.handler.emit('integrationDelete', integration);
        }
    }
}
