import { AutoModerationRuleEventType, AutoModerationRuleTriggerType } from 'discord-api-types/v10';

export function AutoModerationRuleDataResolver(rule: any) {
    const res = rule;

    if (res.event_type && typeof res.event_type !== 'number') {
        res.event_type = AutoModerationRuleEventType[res.event_type];
    }

    if (res.trigger_type && typeof res.trigger_type !== 'number') {
        res.trigger_type = AutoModerationRuleTriggerType[res.trigger_type];
    }

    return res;
}
