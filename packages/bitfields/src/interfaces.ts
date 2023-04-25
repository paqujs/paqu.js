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

export type ApplicationFlagsBitsResolvable = Arrayable<keyof typeof ApplicationFlags | number>;

export type ChannelFlagsBitsResolvable = Arrayable<keyof typeof ChannelFlags | number>;

export type GuildMemberFlagsBitsResolvable = Arrayable<keyof typeof GuildMemberFlags | number>;

export type MessageFlagsBitsResolvable = Arrayable<keyof typeof MessageFlags | number>;

export type PermissionFlagsBitsResolvable = Arrayable<keyof typeof PermissionFlagsBits | number>;

export type PresenceActivityFlagsBitsResolvable = Arrayable<keyof typeof ActivityFlags | number>;

export type ThreadMemberFlagsBitsResolvable = Arrayable<keyof typeof ThreadMemberFlags | number>;

export type SystemChannelFlagsBitsResolvable = Arrayable<
    keyof typeof GuildSystemChannelFlags | number
>;

export type UserFlagsBitsResolvable = Arrayable<keyof typeof UserFlags | number>;
