import type { GatewayIntegrationUpdateDispatch } from '../../../index';
import { BaseAction } from './BaseAction';

export class INTEGRATION_UPDATE extends BaseAction {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayIntegrationUpdateDispatch) {
        const guild = this.handler.client.caches.guilds.cache.get(d.guild_id);
        if (!guild) return;

        let _integration = guild.caches.integrations.cache.get(d.id);

        if (_integration) {
            const integration = _integration;
            _integration = _integration._patch(d);

            this.handler.emit('integrationUpdate', integration, _integration);
        }
    }
}
