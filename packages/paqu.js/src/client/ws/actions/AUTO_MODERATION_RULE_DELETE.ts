import { type GatewayAutoModerationRuleDeleteDispatch, AutoModerationRule } from '../../../index';
import { BaseAction } from './BaseAction';

export class AUTO_MODERATION_RULE_DELETE extends BaseAction {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayAutoModerationRuleDeleteDispatch) {
        const guild = this.handler.client.caches.guilds.cache.get(d.guild_id);

        if (guild) {
            guild.caches.autoModerationRules.cache.delete(d.id);
            this.handler.emit(
                'autoModerationRuleDelete',
                new AutoModerationRule(this.handler.client, d),
            );
        }
    }
}
