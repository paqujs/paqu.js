import {
    type Client,
    type APIAuditLogEntry,
    type Snowflake,
    type AuditLogEntryInfoData,
    type GuildBasedChannelResolvable,
    type MessageableChannelResolvable,
    type GuildBasedInvitableChannelResolvable,
    type ThreadableChannelResolvable,
    type AuditLogChangeData,
    type APIRole,
    type APIOverwrite,
    Role,
    Guild,
    Message,
} from '../../index';
import { AuditLogOptionsType, OverwriteType, AuditLogEvent } from 'discord-api-types/v10';
import { PermissionFlagsBitField } from '@paqujs/bitfields';
import { BaseStructure } from '../base/BaseStructure';

export class AuditLogEntry extends BaseStructure {
    public actionType!: keyof typeof AuditLogEvent;
    public changes!: AuditLogChangeData[];
    public id!: Snowflake;
    public options!: AuditLogEntryInfoData | null;
    public reason!: string | null;
    public targetId!: Snowflake;
    public userId!: Snowflake;
    public guild!: Guild;

    public constructor(client: Client, guild: Guild, data: APIAuditLogEntry) {
        super(client);

        this.guild = guild;

        this._patch(data);
    }

    public override _patch(data: APIAuditLogEntry) {
        this.actionType = AuditLogEvent[data.action_type] as keyof typeof AuditLogEvent;
        this.id = data.id;
        this.reason = data.reason ?? null;
        this.targetId = data.target_id;
        this.userId = data.user_id;
        this.options = data.options
            ? {
                  applicationId: (data.options as any).application_id ?? null,
                  channelId: data.options.channel_id ?? null,
                  count: data.options.count ? +data.options.count : null,
                  deleteMemberDays: data.options.delete_member_days
                      ? +data.options.delete_member_days
                      : null,
                  id: data.options.id,
                  membersRemoved: data.options.members_removed
                      ? +data.options.members_removed
                      : null,
                  messageId: data.options?.message_id ?? null,
                  roleName: data.options?.role_name ?? null,
                  type: AuditLogOptionsType[data.options.type],
              }
            : null;

        this.changes = data.changes
            ? data.changes.map((change) => {
                  return {
                      key: change.key,
                      old: change.old_value
                          ? (change.old_value as unknown as APIRole).color
                              ? new Role(
                                    this.client,
                                    this.guild,
                                    change.old_value as unknown as APIRole,
                                )
                              : (change.old_value as unknown as APIOverwrite).allow
                              ? {
                                    allow: new PermissionFlagsBitField(
                                        +(change.old_value as unknown as APIOverwrite).allow,
                                    ),
                                    deny: new PermissionFlagsBitField(
                                        +(change.old_value as unknown as APIOverwrite).deny,
                                    ),
                                    id: (change.old_value as unknown as APIOverwrite).id,
                                    type: OverwriteType[
                                        (change.old_value as unknown as APIOverwrite).type
                                    ] as keyof typeof OverwriteType,
                                }
                              : (change.old_value as any)
                          : null,
                      new: change.new_value
                          ? (change.new_value as unknown as APIRole).color
                              ? new Role(
                                    this.client,
                                    this.guild,
                                    change.new_value as unknown as APIRole,
                                )
                              : (change.new_value as unknown as APIOverwrite).allow
                              ? {
                                    allow: new PermissionFlagsBitField(
                                        +(change.new_value as unknown as APIOverwrite).allow,
                                    ),
                                    deny: new PermissionFlagsBitField(
                                        +(change.new_value as unknown as APIOverwrite).deny,
                                    ),
                                    id: (change.new_value as unknown as APIOverwrite).id,
                                    type: OverwriteType[
                                        (change.new_value as unknown as APIOverwrite).type
                                    ] as keyof typeof OverwriteType,
                                }
                              : (change.new_value as any)
                          : null,
                  };
              })
            : [];

        return this;
    }

    public get user() {
        return this.client.caches.users.cache.get(this.userId);
    }

    public get target() {
        switch (this.actionType) {
            case 'ApplicationCommandPermissionUpdate':
                return this.guild.caches.commands.cache.get(this.targetId);
                break;
            case 'BotAdd':
                return this.guild.caches.members.cache.get(this.targetId);
                break;
            case 'ChannelCreate':
            case 'ChannelDelete':
            case 'ChannelOverwriteCreate':
            case 'ChannelOverwriteDelete':
            case 'ChannelOverwriteUpdate':
            case 'ChannelUpdate':
                return this.guild.caches.channels.cache.get(this.targetId);
                break;
            case 'EmojiCreate':
            case 'EmojiDelete':
            case 'EmojiUpdate':
                return this.guild.caches.emojis.cache.get(this.targetId);
                break;
            case 'GuildScheduledEventCreate':
            case 'GuildScheduledEventDelete':
            case 'GuildScheduledEventUpdate':
                return this.guild.caches.scheduledEvents.cache.get(this.targetId);
                break;
            case 'GuildUpdate':
                return this.guild;
                break;
            case 'IntegrationCreate':
            case 'IntegrationDelete':
            case 'IntegrationUpdate':
                return this.guild.caches.integrations.cache.get(this.targetId);
                break;
            case 'InviteCreate':
            case 'InviteDelete':
            case 'InviteUpdate':
                return (
                    this.channel as GuildBasedInvitableChannelResolvable
                ).caches?.invites?.cache?.get(this.targetId);
                break;
            case 'MemberBanAdd':
            case 'MemberBanRemove':
            case 'MemberDisconnect':
            case 'MemberKick':
            case 'MemberMove':
            case 'MemberPrune':
            case 'MemberRoleUpdate':
            case 'MemberUpdate':
                return this.guild.caches.members.cache.get(this.targetId);
                break;
            case 'MessageBulkDelete':
            case 'MessageDelete':
            case 'MessagePin':
            case 'MessageUnpin':
                return this.message;
                break;
            case 'RoleCreate':
            case 'RoleDelete':
            case 'RoleUpdate':
                return this.guild.caches.roles.cache.get(this.targetId);
                break;
            case 'StageInstanceCreate':
            case 'StageInstanceDelete':
            case 'StageInstanceUpdate':
                return this.guild.caches.stageInstances.cache.get(this.targetId);
                break;
            case 'StickerCreate':
            case 'StickerDelete':
            case 'StickerUpdate':
                return this.guild.caches.stickers.cache.get(this.targetId);
                break;
            case 'ThreadCreate':
            case 'ThreadDelete':
            case 'ThreadUpdate':
                return (this.channel as ThreadableChannelResolvable).caches.threads.cache.get(
                    this.targetId,
                );
                break;
            case 'WebhookCreate':
            case 'WebhookDelete':
            case 'WebhookUpdate':
                return this.client.caches.webhooks.cache.get(this.targetId);
                break;
            default:
                return undefined;
        }
    }

    public get channel(): GuildBasedChannelResolvable | undefined {
        return this.guild.caches.channels.cache.get(this.options?.channelId);
    }

    public get message(): Message | undefined {
        return (this.channel as MessageableChannelResolvable).caches.messages.cache.get(
            this.options?.messageId,
        );
    }
}
