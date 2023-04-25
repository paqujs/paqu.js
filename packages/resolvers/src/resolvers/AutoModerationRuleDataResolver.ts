import { AutoModerationRuleEventType } from '../index';

export function AutoModerationRuleDataResolver(rule: any) {
    const res = rule;

    if (res.event_type && typeof res.event_type !== 'number') {
        res.event_type = AutoModerationRuleEventType[res.event_type];
    }

    return res;
}
