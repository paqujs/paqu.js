import {
    ApplicationFlags,
    ChannelFlags,
    GuildMemberFlags,
    MessageFlags,
    PermissionFlagsBits,
    ActivityFlags,
    ThreadMemberFlags,
    GuildSystemChannelFlags,
    UserFlags,
} from './index';
import type { Arrayable } from '@paqujs/shared';

export type ApplicationFlagsBitsResolvable = Arrayable<
    keyof typeof ApplicationFlags | ApplicationFlags
>;

export type ChannelFlagsBitsResolvable = Arrayable<keyof typeof ChannelFlags | ChannelFlags>;

export type GuildMemberFlagsBitsResolvable = Arrayable<
    keyof typeof GuildMemberFlags | GuildMemberFlags
>;

export type MessageFlagsBitsResolvable = Arrayable<keyof typeof MessageFlags | MessageFlags>;

export type PermissionFlagsBitsResolvable = Arrayable<keyof typeof PermissionFlagsBits | number>;

export type PresenceActivityFlagsBitsResolvable = Arrayable<
    keyof typeof ActivityFlags | ActivityFlags
>;

export type ThreadMemberFlagsBitsResolvable = Arrayable<
    keyof typeof ThreadMemberFlags | ThreadMemberFlags
>;

export type SystemChannelFlagsBitsResolvable = Arrayable<
    keyof typeof GuildSystemChannelFlags | GuildSystemChannelFlags
>;

export type UserFlagsBitsResolvable = Arrayable<keyof typeof UserFlags | UserFlags>;
