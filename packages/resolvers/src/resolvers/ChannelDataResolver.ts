import {
    DataResolver,
    ChannelType,
    VideoQualityMode,
    OverwriteType,
    ThreadAutoArchiveDuration,
    ForumLayoutType,
    SortOrderType,
} from '../index';
import { PermissionFlagsBitField, ChannelFlagsBitField } from '@paqujs/bitfields';

export async function ChannelDataResolver(channel: any) {
    const res = channel;

    if ('icon' in res) {
        res.icon = await DataResolver.resolveBase64(res.icon!);
    }

    if ('type' in res) {
        if (typeof res.type === 'string') res.type = ChannelType[res.type!];
    }

    if ('permission_overwrites' in res) {
        for (const overwrite of res.permission_overwrites!) {
            if ('allow' in overwrite) {
                overwrite.allow = new PermissionFlagsBitField().set(overwrite.allow!);
            }

            if ('deny' in overwrite) {
                overwrite.deny = new PermissionFlagsBitField().set(overwrite.deny!);
            }

            if ('type' in overwrite) {
                if (typeof overwrite.type === 'string')
                    overwrite.type = OverwriteType[overwrite.type!];
            }
        }
    }

    if ('video_quality_mode' in res) {
        if (typeof res.video_quality_mode === 'string')
            res.video_quality_mode = VideoQualityMode[res.video_quality_mode!];
    }

    if ('type' in res) {
        if (typeof res.type === 'string') res.type = ChannelType[res.type!];
    }

    if ('default_sort_order' in res) {
        if (typeof res.default_sort_order === 'string')
            res.default_sort_order = SortOrderType[res.default_sort_order!];
    }

    if ('flags' in res) {
        res.flags = new ChannelFlagsBitField().set(res.flags!);
    }

    if ('auto_archive_duration' in res) {
        if (typeof res.auto_archive_duration === 'string')
            res.auto_archive_duration = ThreadAutoArchiveDuration[res.auto_archive_duration!];
    }

    if ('default_forum_layout' in res) {
        if (typeof res.default_forum_layout === 'string')
            res.default_forum_layout = ForumLayoutType[res.default_forum_layout!];
    }

    return res;
}
