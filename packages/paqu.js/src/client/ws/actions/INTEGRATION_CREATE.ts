import { type GatewayIntegrationCreateDispatch, GuildIntegration } from '../../../index';
import { BaseAction } from './BaseAction';

export class INTEGRATION_CREATE extends BaseAction {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayIntegrationCreateDispatch) {
        const guild = this.handler.client.caches.guilds.cache.get(d.guild_id);
        if (!guild) return;

        this.handler.emit(
            'integrationCreate',
            guild.caches.integrations.cache.setAndReturnValue(
                d.id,
                new GuildIntegration(this.handler.client, guild, d),
            ),
        );
    }
}
