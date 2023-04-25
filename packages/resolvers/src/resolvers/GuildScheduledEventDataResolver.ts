import {
    DataResolver,
    GuildScheduledEventPrivacyLevel,
    GuildScheduledEventEntityType,
    GuildScheduledEventStatus,
} from '../index';

export async function GuildScheduledEventDataResolver(scheduledEvent: any) {
    const res = scheduledEvent;

    if ('privacy_level' in res) {
        if (typeof res.privacy_level === 'string') {
            res.privacy_level = GuildScheduledEventPrivacyLevel[res.privacy_level];
        }
    }

    if ('scheduled_start_time' in res) {
        //@ts-ignore
        res.scheduled_start_time = new Date(res.scheduled_start_time).toISOString();
    }

    if ('scheduled_end_time' in res) {
        //@ts-ignore
        res.scheduled_end_time = new Date(res.scheduled_end_time).toISOString();
    }

    if ('entity_type' in res) {
        //@ts-ignore
        res.entity_type = GuildScheduledEventEntityType[res.entity_type];
    }

    if ('image' in res) {
        //@ts-ignore
        res.image = await DataResolver.resolveImage(res.image);
    }

    if ('status' in res) {
        //@ts-ignore
        res.status = GuildScheduledEventStatus[res.status];
    }

    return res;
}
