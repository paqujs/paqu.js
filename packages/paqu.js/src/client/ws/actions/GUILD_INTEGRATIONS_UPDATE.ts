import type { GatewayGuildIntegrationsUpdateDispatch } from '../../../index';
import { BaseAction } from './BaseAction';

export class GUILD_INTEGRATIONS_UPDATE extends BaseAction {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayGuildIntegrationsUpdateDispatch) {
        const guild = this.handler.client.caches.guilds.cache.get(d.guild_id);
        if (!guild) return;

        this.handler.emit('guildIntegrationsUpdate', guild);
    }
}
