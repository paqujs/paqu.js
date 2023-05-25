import type { GatewayAutoModerationRuleUpdateDispatch } from '../../../index';
import { BaseAction } from './BaseAction';

export class AUTO_MODERATION_RULE_UPDATE extends BaseAction {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayAutoModerationRuleUpdateDispatch) {
        const guild = this.handler.client.caches.guilds.cache.get(d.guild_id);

        if (guild) {
            let _autoModerationRule = guild.caches.autoModerationRules.cache.get(d.id);

            if (_autoModerationRule) {
                const autoModerationRule = _autoModerationRule;

                _autoModerationRule = _autoModerationRule._patch(d);

                this.handler.emit(
                    'autoModerationRuleUpdate',
                    autoModerationRule,
                    _autoModerationRule,
                );
            }
        }
    }
}
