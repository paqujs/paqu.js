import { type GatewayAutoModerationRuleCreateDispatch, AutoModerationRule } from '../../../index';
import { BaseAction } from './BaseAction';

export class AUTO_MODERATION_RULE_CREATE extends BaseAction {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayAutoModerationRuleCreateDispatch) {
        const guild = this.handler.client.caches.guilds.cache.get(d.guild_id);

        if (guild) {
            this.handler.emit(
                'autoModerationRuleCreate',
                guild.caches.autoModerationRules.cache.setAndReturnValue(
                    d.id,
                    new AutoModerationRule(this.handler.client, d),
                ),
            );
        }
    }
}
