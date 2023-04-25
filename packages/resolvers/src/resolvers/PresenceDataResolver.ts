import { ActivityType, PresenceActivityFlagsBitsResolver } from '../index';

export function PresenceDataResolver(presence: any) {
    const res = presence;

    if (res.activities) {
        for (const activity of res.activities) {
            if (typeof activity.type === 'string') {
                activity.type = ActivityType[activity.type as keyof typeof ActivityType];
            }

            if (typeof activity.flags === 'string') {
                activity.flags = PresenceActivityFlagsBitsResolver(activity.flags);
            }
        }
    }

    return res;
}
