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
            case 'GuildUpdate':
                return this.guild;
                break;
            case 'ChannelCreate':
            case 'ChannelUpdate':
            case 'ChannelDelete':
            case 'ChannelOverwriteCreate':
            case 'ChannelOverwriteUpdate':
            case 'ChannelOverwriteDelete':
                return this.guild.caches.channels.cache.get(this.targetId);
                break;
            case 'MemberKick':
            case 'MemberPrune':
            case 'MemberBanAdd':
            case 'MemberBanRemove':
            case 'MemberUpdate':
            case 'MemberRoleUpdate':
            case 'MemberMove':
            case 'MemberDisconnect':
            case 'BotAdd':
                return this.guild.caches.members.cache.get(this.targetId);
                break;
            case 'RoleCreate':
            case 'RoleUpdate':
            case 'RoleDelete':
                return this.guild.caches.roles.cache.get(this.targetId);
                break;
            case 'InviteCreate':
            case 'InviteUpdate':
            case 'InviteDelete':
                return (
                    this.channel as GuildBasedInvitableChannelResolvable
                ).caches?.invites?.cache?.get(this.targetId);
                break;
            case 'WebhookCreate':
            case 'WebhookUpdate':
            case 'WebhookDelete':
                return this.client.caches.webhooks.cache.get(this.targetId);
                break;
            case 'EmojiCreate':
            case 'EmojiUpdate':
            case 'EmojiDelete':
                return this.guild.caches.emojis.cache.get(this.targetId);
                break;
            case 'MessageDelete':
            case 'MessageBulkDelete':
            case 'MessagePin':
            case 'MessageUnpin':
                return this.message;
                break;
            case 'IntegrationCreate':
            case 'IntegrationUpdate':
            case 'IntegrationDelete':
                return this.guild.caches.integrations.cache.get(this.targetId);
                break;
            case 'StageInstanceCreate':
            case 'StageInstanceUpdate':
            case 'StageInstanceDelete':
                return this.guild.caches.stageInstances.cache.get(this.targetId);
                break;
            case 'StickerCreate':
            case 'StickerUpdate':
            case 'StickerDelete':
                return this.guild.caches.stickers.cache.get(this.targetId);
                break;
            case 'GuildScheduledEventCreate':
            case 'GuildScheduledEventUpdate':
            case 'GuildScheduledEventDelete':
                return this.guild.caches.scheduledEvents.cache.get(this.targetId);
                break;
            case 'ThreadCreate':
            case 'ThreadUpdate':
            case 'ThreadDelete':
                return (this.channel as ThreadableChannelResolvable).caches.threads.cache.get(
                    this.targetId,
                );
                break;
            case 'ApplicationCommandPermissionUpdate':
                return this.guild.caches.commands.cache.get(this.targetId);
                break;
            case 'AutoModerationRuleCreate':
            case 'AutoModerationRuleUpdate':
            case 'AutoModerationRuleDelete':
                return this.guild.caches.autoModerationRules.cache.get(this.targetId);
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
