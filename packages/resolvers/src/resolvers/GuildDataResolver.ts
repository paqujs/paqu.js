import {
    SystemChannelFlagsBitsResolver,
    GuildExplicitContentFilter,
    GuildDefaultMessageNotifications,
    GuildFeature,
    GuildVerificationLevel,
    RoleDataResolver,
} from '../index';
import { SystemChannelFlagsBitField } from '@paqujs/bitfields';

export function GuildDataResolver(guild: any) {
    const res = guild;

    if (res.explicit_content_filter && typeof res.explicit_content_filter !== 'number') {
        res.explicit_content_filter = GuildExplicitContentFilter[
            res.explicit_content_filter as unknown as number
        ] as any;
    }

    if (
        res.default_message_notifications &&
        typeof res.default_message_notifications !== 'number'
    ) {
        res.default_message_notifications = GuildDefaultMessageNotifications[
            res.default_message_notifications as unknown as number
        ] as unknown as number;
    }

    if (res.system_channel_flags) {
        res.system_channel_flags = new SystemChannelFlagsBitField().set(
            SystemChannelFlagsBitsResolver(res.system_channel_flags),
        );
    }

    if (res.verification_level && typeof res.verification_level !== 'number') {
        res.verification_level = GuildVerificationLevel[
            res.verification_level as unknown as number
        ] as unknown as number;
    }

    if ('features' in res) {
        res.features = res.features?.map(
            (feature) => GuildFeature[feature as unknown as keyof typeof GuildFeature],
        ) as unknown as (keyof typeof GuildFeature)[];
    }

    if ('roles' in res) {
        res.roles = res.roles?.map((role) => RoleDataResolver(role));
    }

    return res;
}
