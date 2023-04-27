import { DataResolver } from '../index';
import {
    GuildScheduledEventPrivacyLevel,
    GuildScheduledEventEntityType,
    GuildScheduledEventStatus,
} from 'discord-api-types/v10';

export async function GuildScheduledEventDataResolver(scheduledEvent: any) {
    const res = scheduledEvent;

    if ('privacy_level' in res) {
        if (typeof res.privacy_level === 'string') {
            res.privacy_level = GuildScheduledEventPrivacyLevel[res.privacy_level];
        }
    }

    if ('scheduled_start_time' in res) {
        res.scheduled_start_time = new Date(res.scheduled_start_time).toISOString();
    }

    if ('scheduled_end_time' in res) {
        res.scheduled_end_time = new Date(res.scheduled_end_time).toISOString();
    }

    if ('entity_type' in res) {
        res.entity_type = GuildScheduledEventEntityType[res.entity_type];
    }

    if ('image' in res) {
        res.image = await DataResolver.resolveImage(res.image);
    }

    if ('status' in res) {
        res.status = GuildScheduledEventStatus[res.status];
    }

    return res;
}
