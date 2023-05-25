import type {
    Snowflake,
    GuildMFALevel,
    Client,
    APIGuild,
    Guild,
    GatewayDispatchPayload,
    User,
    GuildEmoji,
    GatewayGuildCreateDispatchData,
    Sticker,
    RESTPatchAPIGuildJSONBody,
    GuildExplicitContentFilter,
    GuildDefaultMessageNotifications,
    GuildFeature,
    GuildVerificationLevel,
    RESTPostAPIGuildsJSONBody,
    Role,
    RESTPatchAPIGuildMemberJSONBody,
    GuildBan,
    Presence,
    ApplicationCommandTypeResolvable,
    ApplicationCommandType,
    GuildMember,
    MessageActivityType,
    VideoQualityMode,
    VoiceChannel,
    DMChannel,
    ChannelTypeResolvable,
    GroupDMChannel,
    ThreadChannel,
    AnnouncementChannel,
    TextChannel,
    CategoryChannel,
    StageChannel,
    Message,
    APITextChannel,
    APIGuildCategoryChannel,
    APINewsChannel,
    APIThreadChannel,
    APIGroupDMChannel,
    APIDMChannel,
    RESTPatchAPIChannelMessageJSONBody,
    APIMessageReference,
    InviteTargetType,
    RESTPostAPIChannelInviteJSONBody,
    APIEmbed,
    RESTPostAPIGuildScheduledEventJSONBody,
    GuildScheduledEventPrivacyLevel,
    GuildScheduledEventEntityType,
    RESTPostAPIGuildEmojiJSONBody,
    RESTPatchAPIGuildScheduledEventJSONBody,
    GuildScheduledEventStatus,
    RESTPostAPIStageInstanceJSONBody,
    RESTPatchAPIStageInstanceJSONBody,
    StageInstancePrivacyLevel,
    APIGuildVoiceChannel,
    APIGuildStageVoiceChannel,
    APIAllowedMentions,
    GuildScheduledEvent,
    GuildIntegration,
    ApplicationCommandPermissionType,
    LocalizationMap,
    APIApplicationCommandOptionChoice,
    StageInstance,
    ThreadMember,
    Typing,
    VoiceState,
    MessageReaction,
    Invite,
    AutocompleteInteraction,
    ButtonInteraction,
    ChatInputCommandInteraction,
    UserCommandInteraction,
    MessageCommandInteraction,
    ChannelSelectMenuInteraction,
    MentionableSelectMenuInteraction,
    RoleSelectMenuInteraction,
    UserSelectMenuInteraction,
    StringSelectMenuInteraction,
    APIApplicationCommandAutocompleteInteraction,
    APIMessageComponentButtonInteraction,
    APIChatInputApplicationCommandInteraction,
    APIUserApplicationCommandInteraction,
    APIMessageComponentSelectMenuInteraction,
    ComponentType,
    ModalSubmitInteraction,
    APIModalSubmitInteraction,
    InteractionDataResolvedChannel,
    Attachment,
    ApplicationCommandOptionType,
    AuditLogOptionsType,
    APIAuditLogChange,
    OverwriteType,
    APIGuildForumChannel,
    ForumChannel,
    RESTPutAPIGuildBanJSONBody,
    SortOrderType,
    APIPingInteraction,
    PingInteraction,
    APIGuildForumTag,
    APIGuildForumDefaultReactionEmoji,
    AutoModerationRuleKeywordPresetType,
    AutoModerationRuleEventType,
    AutoModerationActionType,
    AutoModerationRule,
    AutoModerationActionException,
    ThreadAutoArchiveDuration,
    GatewayReceivePayload,
    APIInteractionDataResolved,
    ForumLayoutType,
    ApplicationRoleConnectionMetadataType,
    AuditLogEntry,
    ThreadType,
    APIAnyComponent,
} from './index';
import type {
    PermissionFlagsBitField,
    PermissionFlagsBitsResolvable,
    ChannelFlagsBitsResolvable,
    SystemChannelFlagsBitsResolvable,
    MessageFlagsBitsResolvable,
} from '@paqujs/bitfields';
import type { PresenceStatus, WebSocketShard } from '@paqujs/ws';
import type { Collection, Arrayable } from '@paqujs/shared';
import type { ColorResolvable } from '@paqujs/resolvers';
import type { FileData } from '@paqujs/resolvers';

export interface GuildForumChannelTagData {
    id: Snowflake;
    name: string;
    moderated: boolean;
    emojiId: Snowflake;
    emojiName: string | null;
}

export interface GuildForumChannelDefaultReactionEmojiData {
    emojiId: Snowflake;
    emojiName: string | null;
}

export interface GuildForumChannelThreadMessageParamsData {
    content?: string;
    embeds?: EmbedData[];
    allowed_mentions?: APIAllowedMentions;
    components?: APIAnyComponent[];
    stickers?: Snowflake[];
    files?: (string | Buffer | FileData)[];
    attachments?: (MessageAttachmentData | Attachment)[];
    flags?: MessageFlagsBitsResolvable;
}

export type Collectionable<K, V> = V | Collection<K, V>;

export interface ImageOptions {
    format?: 'png' | 'jpg' | 'jpeg' | 'webp' | 'gif' | 'json';
    size?: 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096 | 8192;
    dynamic?: boolean;
}

export interface APIGuildWithShard extends APIGuild {
    shard_id?: number;
}

export interface GatewayGuildCreateDispatchDataWithShard extends GatewayGuildCreateDispatchData {
    shard_id?: number;
}

export interface ClientUserEditData {
    username?: string;
    avatar?: string;
}

export interface FetchGuildOptions extends FetchOptions {
    with_counts?: boolean;
}

export interface FetchBanOptions extends FetchOptions {
    limit?: number;
    before?: Snowflake;
    after?: Snowflake;
}

export interface FetchMemberOptions extends FetchOptions {
    limit?: number;
    after?: Snowflake;
}

export interface FetchOptions {
    force?: boolean;
}

export interface EditAndCreateRoleData {
    name?: string;
    permissions?: PermissionFlagsBitsResolvable;
    color?: ColorResolvable;
    hoist?: boolean;
    icon?: string | Buffer;
    unicode_emoji?: string;
    mentionable?: boolean;
}

export interface RoleTags {
    botId?: string | null;
    integrationId?: string | null;
    premiumSubscriber?: true | null;
    subscriptionListingId?: string | null;
    availableForPurchase?: null;
    guildConnections?: null;
}

export type GuildMFALevelResolvable = keyof typeof GuildMFALevel | GuildMFALevel;

export interface GuildFetchPruneOptions {
    days?: number;
    includeRoles?: 'none' | Snowflake[];
}

export interface CreateStickerData {
    name: string;
    description?: string;
    tags: string;
    file: Buffer | string;
}

export type GuildExplicitContentFilterResolvable =
    | keyof typeof GuildExplicitContentFilter
    | GuildExplicitContentFilter;

export type GuildDefaultMessageNotificationsResolvable =
    | keyof typeof GuildDefaultMessageNotifications
    | GuildDefaultMessageNotifications;

export type GuildVerificationLevelResolvable =
    | keyof typeof GuildVerificationLevel
    | GuildVerificationLevel;

export interface EditGuildData
    extends Omit<
        RESTPatchAPIGuildJSONBody,
        [
            'explicit_content_filter',
            'default_message_notifications',
            'features',
            'system_channel_flags',
            'verification_level',
        ]
    > {
    explicit_content_filter?: GuildExplicitContentFilterResolvable;
    default_message_notifications?: GuildDefaultMessageNotificationsResolvable;
    features?: (keyof typeof GuildFeature)[];
    system_channel_flags?: SystemChannelFlagsBitsResolvable;
    verification_level?: GuildVerificationLevelResolvable;
}

export interface CreateGuildData
    extends Omit<
        RESTPostAPIGuildsJSONBody,
        [
            'explicit_content_filter',
            'default_message_notifications',
            'system_channel_flags',
            'verification_level',
            'roles',
            'channels',
        ]
    > {
    explicit_content_filter?: GuildExplicitContentFilterResolvable;
    default_message_notifications?: GuildDefaultMessageNotificationsResolvable;
    system_channel_flags?: SystemChannelFlagsBitsResolvable;
    verification_level?: GuildVerificationLevelResolvable;
    roles?: EditAndCreateRoleData[];
    channels?: EditAndCreateGuildChannelData[];
}

export interface EditGuildMemberData
    extends Omit<RESTPatchAPIGuildMemberJSONBody, ['communication_disabled_until']> {
    communication_disabled_until?: number;
}

export interface PresenceClientStatusData {
    desktop?: PresenceStatus;
    mobile?: PresenceStatus;
    web?: PresenceStatus;
}

export interface EditGroupDMChannelData {
    name?: string;
    icon?: Buffer | string;
}

export type VoiceQualityModeResolvable = keyof typeof VideoQualityMode | VideoQualityMode;

export type ChannelOverwriteTypeResolvable = keyof typeof OverwriteType | OverwriteType;

export interface ChannelOverwriteData {
    id: Snowflake;
    type: keyof typeof OverwriteType;
    allow?: PermissionFlagsBitField;
    deny?: PermissionFlagsBitField;
}

export interface CreateChannelOverwriteData {
    id: Snowflake;
    type: ChannelOverwriteTypeResolvable;
    allow?: PermissionFlagsBitsResolvable;
    deny?: PermissionFlagsBitsResolvable;
}

export type ForumChannelDefaultSortOrderTypeResolvable = keyof typeof SortOrderType | SortOrderType;

export type ThreadAutoArchiveDurationResolvable =
    | keyof typeof ThreadAutoArchiveDuration
    | ThreadAutoArchiveDuration;

export interface EditThreadChannelData {
    name?: string;
    archived?: boolean;
    auto_archive_duration?: ThreadAutoArchiveDurationResolvable;
    locked?: boolean;
    invitable?: boolean;
    rate_limit_per_user?: number;
    flags?: ChannelFlagsBitsResolvable;
    applied_tags?: Snowflake[];
}

export type ForumChannelDefaultForumLayoutTypeResolvable =
    | keyof typeof ForumLayoutType
    | ForumLayoutType;

export interface EditAndCreateGuildChannelData {
    name?: string;
    type?: ChannelTypeResolvable;
    position?: number;
    topic?: string;
    nsfw?: boolean;
    rate_limit_per_user?: number;
    bitrate?: number;
    user_limit?: number;
    permission_overwrites?: CreateChannelOverwriteData[];
    parent_id?: Snowflake;
    rtc_region?: string;
    video_quality_mode?: VoiceQualityModeResolvable;
    default_auto_archive_duration?: number;
    flags?: ChannelFlagsBitsResolvable;
    available_tags?: APIGuildForumTag[];
    default_reaction_emoji?: APIGuildForumDefaultReactionEmoji;
    default_thread_rate_limit_per_user?: number;
    default_sort_order?: ForumChannelDefaultSortOrderTypeResolvable;
    default_forum_layout?: ForumChannelDefaultForumLayoutTypeResolvable;
}

export type EditChannelData =
    | EditAndCreateGuildChannelData
    | EditGroupDMChannelData
    | EditThreadChannelData;

export interface MessageActivity {
    type: keyof typeof MessageActivityType;
    partyId: string | null;
}

export type TextBasedChannelResolvable =
    | TextChannel
    | DMChannel
    | GroupDMChannel
    | AnnouncementChannel
    | ThreadChannel
    | ForumChannel;

export type TextBasedNonThreadChannelResolvable =
    | TextChannel
    | DMChannel
    | GroupDMChannel
    | AnnouncementChannel
    | ForumChannel;

export type GuildTextBasedNonThreadChannelResolvable =
    | TextChannel
    | AnnouncementChannel
    | ForumChannel;

export type DMBasedChannelResolvable = DMChannel | GroupDMChannel;

export type GuildTextBasedChannelResolvable =
    | TextChannel
    | AnnouncementChannel
    | ThreadChannel
    | ForumChannel;

export type VoiceBasedChannelResolvable = VoiceChannel | StageChannel;

export type GuildBasedChannelResolvable =
    | VoiceBasedChannelResolvable
    | GuildTextBasedChannelResolvable
    | CategoryChannel;

export type GuildBasedNonCategoryChannelResolvable =
    | VoiceBasedChannelResolvable
    | GuildTextBasedChannelResolvable;

export type GuildBasedNonThreadChannelResolvable =
    | VoiceBasedChannelResolvable
    | TextChannel
    | AnnouncementChannel
    | ForumChannel;

export type GuildBasedInvitableChannelResolvable =
    | VoiceBasedChannelResolvable
    | TextChannel
    | AnnouncementChannel
    | ForumChannel;

export type GuildBasedPermissionOverwritableChannelResolvable =
    | VoiceBasedChannelResolvable
    | TextChannel
    | CategoryChannel
    | AnnouncementChannel
    | ForumChannel;

export type AnyChannel = GuildBasedChannelResolvable | DMBasedChannelResolvable;

export type PinnableChannelResolvable =
    | DMBasedChannelResolvable
    | TextChannel
    | AnnouncementChannel
    | ForumChannel;

export type MessageableChannelResolvable =
    | DMBasedChannelResolvable
    | GuildTextBasedChannelResolvable
    | VoiceChannel
    | ForumChannel;

export type GuildBasedMessageableChannelResolvable =
    | GuildTextBasedChannelResolvable
    | VoiceChannel
    | ForumChannel;

export type WebhookableChannelResolvable =
    | TextChannel
    | AnnouncementChannel
    | VoiceChannel
    | ForumChannel;

export type ThreadableChannelResolvable = TextChannel | AnnouncementChannel | ForumChannel;

export type APITextBasedChannelResolvable =
    | APITextChannel
    | APINewsChannel
    | APIThreadChannel
    | APIDMChannel
    | APIGroupDMChannel
    | APIGuildForumChannel;

export type APITextBasedNonThreadChannelResolvable =
    | APITextChannel
    | APIDMChannel
    | APIGroupDMChannel
    | APINewsChannel
    | APIGuildForumChannel;

export type APIGuildTextBasedNonThreadChannelResolvable =
    | APITextChannel
    | APINewsChannel
    | APIGuildForumChannel;

export type APIDMBasedChannelResolvable = APIDMChannel | APIGroupDMChannel;

export type APIGuildTextBasedChannelResolvable =
    | APITextChannel
    | APINewsChannel
    | APIThreadChannel
    | APIGuildForumChannel;

export type APIVoiceBasedChannelResolvable = APIGuildVoiceChannel | APIGuildStageVoiceChannel;

export type APIGuildBasedChannelResolvable =
    | APIVoiceBasedChannelResolvable
    | APIGuildTextBasedChannelResolvable
    | APIGuildCategoryChannel;

export type APIGuildBasedNonCategoryChannelResolvable =
    | APIVoiceBasedChannelResolvable
    | APIGuildTextBasedChannelResolvable;

export type APIGuildBasedNonThreadChannelResolvable =
    | APIVoiceBasedChannelResolvable
    | APITextChannel
    | APINewsChannel
    | APIGuildForumChannel;

export type APIGuildBasedInvitableChannelResolvable =
    | APIVoiceBasedChannelResolvable
    | APITextChannel
    | APINewsChannel
    | APIGuildForumChannel;

export type APIGuildBasedPermissionOverwritableChannelResolvable =
    | APIVoiceBasedChannelResolvable
    | APITextChannel
    | APIGuildCategoryChannel
    | AnnouncementChannel
    | APIGuildForumChannel;

export type APIAnyChannel = APIGuildBasedChannelResolvable | APIDMBasedChannelResolvable;

export type APIPinnableChannelResolvable =
    | APIDMBasedChannelResolvable
    | APITextChannel
    | APINewsChannel
    | APIGuildForumChannel;

export type APIMessageableChannelResolvable =
    | APIDMBasedChannelResolvable
    | APIGuildTextBasedChannelResolvable
    | APIVoiceBasedChannelResolvable
    | APIGuildForumChannel;

export type APIGuildBasedMessageableChannelResolvable =
    | APIGuildTextBasedChannelResolvable
    | APIVoiceBasedChannelResolvable
    | APIGuildForumChannel;

export type APIWebhookableChannelResolvable =
    | APITextChannel
    | APINewsChannel
    | APIGuildVoiceChannel
    | APIGuildForumChannel;

export type APIThreadableChannelResolvable = APITextChannel | APINewsChannel;

export interface MessageReactionData {
    count: number;
    me: boolean;
    emoji: string;
}

export interface FetchReactionOptions {
    limit?: number;
    after?: Snowflake;
}

export interface EmbedData extends Omit<APIEmbed, ['color']> {
    color?: ColorResolvable;
}

export interface MessageAttachmentData {
    filename: string;
    description: string;
}

export interface EditMessageData
    extends Omit<
        RESTPatchAPIChannelMessageJSONBody,
        ['flags', 'embeds', 'components', 'attachments']
    > {
    files?: (Buffer | string | FileData)[];
    flags?: MessageFlagsBitsResolvable;
    embeds: EmbedData[];
    components?: APIAnyComponent[];
    attachments?: (MessageAttachmentData | Attachment)[];
}

export interface CreateMessageData extends Omit<EditMessageData, ['embeds']> {
    message_reference?: MessageReferenceData;
    tts?: boolean;
    stickers?: Snowflake[];
    embeds?: EmbedData[];
}

export interface MessageReferenceData extends APIMessageReference {
    fail_if_not_exists?: boolean;
}

export interface EditGuildChannelPositionsData {
    position?: number;
    sync_permissions?: boolean;
    parent_id?: Snowflake;
}

export type InviteTargetTypeResolvable = keyof typeof InviteTargetType | InviteTargetType;

export interface CreateInviteData extends Omit<RESTPostAPIChannelInviteJSONBody, ['target_type']> {
    target_type?: InviteTargetTypeResolvable;
}

export interface FetchInviteOptions extends FetchOptions {
    with_counts?: boolean;
    with_expiration?: boolean;
    scheduled_event_id?: Snowflake;
}

export interface FetchGuildScheduledEventOptions extends FetchOptions {
    with_user_count?: boolean;
}

export type GuildScheduledEventPrivacyLevelResolvable =
    | keyof typeof GuildScheduledEventPrivacyLevel
    | GuildScheduledEventPrivacyLevel;

export type GuildScheduledEventEntityTypeResolvable =
    | keyof typeof GuildScheduledEventEntityType
    | GuildScheduledEventEntityType;

export type GuildScheduledEventStatusResolvable =
    | keyof typeof GuildScheduledEventStatus
    | GuildScheduledEventStatus;

export interface CreateGuildScheduledEventData
    extends Omit<
        RESTPostAPIGuildScheduledEventJSONBody,
        ['privacy_level', 'scheduled_start_time', 'scheduled_end_time', 'entity_type', 'image']
    > {
    privacy_level?: GuildScheduledEventPrivacyLevelResolvable;
    scheduled_start_time: number;
    scheduled_end_time?: number;
    entity_type: GuildScheduledEventEntityTypeResolvable;
    image?: string | Buffer;
}

export interface EditGuildScheduledEventData
    extends Omit<
        RESTPatchAPIGuildScheduledEventJSONBody,
        [
            'privacy_level',
            'scheduled_start_time',
            'scheduled_end_time',
            'entity_type',
            'status',
            'image',
        ]
    > {
    privacy_level?: GuildScheduledEventPrivacyLevelResolvable;
    scheduled_start_time?: number;
    scheduled_end_time?: number;
    entity_type?: GuildScheduledEventEntityTypeResolvable;
    image?: string | Buffer;
    status?: GuildScheduledEventStatusResolvable;
}

export interface CreateEmojiData extends Omit<RESTPostAPIGuildEmojiJSONBody, ['image']> {
    image: string | Buffer;
}

export interface EditEmojiData {
    name?: string;
    roles?: Snowflake[];
}

export interface GuildScheduledEventUserData {
    guildScheduledEventId: Snowflake;
    user: User;
    member: GuildMember | null;
}

export type ReplyMessageOptions = Omit<CreateMessageData, ['message_reference']>;

export type StageInstancePrivacyLevelResolvable =
    | keyof typeof StageInstancePrivacyLevel
    | StageInstancePrivacyLevel;

export interface CreateStageInstanceData
    extends Omit<RESTPostAPIStageInstanceJSONBody, ['privacy_level']> {
    privacy_level?: StageInstancePrivacyLevelResolvable;
}

export interface EditStageInstanceData
    extends Omit<RESTPatchAPIStageInstanceJSONBody, ['privacy_level']> {
    privacy_level?: StageInstancePrivacyLevelResolvable;
}

export interface GroupDMAddRecipientData {
    access_token: string;
    nick: string;
}

export interface FetchArchivedThreadOptions {
    before?: number;
    limit?: number;
}

export interface CreateWebhookData {
    name: string;
    avatar?: string | Buffer;
}

export interface EditWebhookData {
    name?: string;
    avatar?: string | Buffer;
    channel_id?: Snowflake;
}

export interface EditWebhookMessageData {
    content?: string;
    embeds?: EmbedData[];
    allowed_mentions?: APIAllowedMentions;
    files?: (Buffer | string | FileData)[];
    attachments?: (MessageAttachmentData | Attachment)[];
}

export interface CreateWebhookMessageData extends EditWebhookMessageData {
    username?: string;
    avatar_url?: string;
    tts?: boolean;
    flags?: MessageFlagsBitsResolvable;
    thread_name?: string;
}

export interface CreateWebhookMessageOptions {
    wait?: boolean;
    thread_id?: Snowflake;
}

export interface CreateBanOptions extends RESTPutAPIGuildBanJSONBody {
    reason?: string;
}

export interface EditGuildMeVoiceStateData {
    channel_id?: Snowflake;
    suppress?: boolean;
    request_to_speak_timestamp?: number;
}

export interface AutoModerationRuleTriggerMetadata {
    keywordFilter: string[];
    presets: (keyof typeof AutoModerationRuleKeywordPresetType)[];
    allowList: string[];
    mentionTotalLimit: number;
    regexPatterns: string[];
}

export interface AutoModerationRuleActionMetadata {
    channelId: Snowflake;
    durationSeconds: number;
}

export interface AutoModerationRuleActionData {
    type: keyof typeof AutoModerationActionType;
    metadata?: AutoModerationRuleActionMetadata | null;
}

export type AutoModerationRuleEventTypeResolvable =
    | keyof typeof AutoModerationRuleEventType
    | AutoModerationRuleEventType;

export interface EditAndCreateAutoModerationRuleTriggerMetadata {
    keyword_filter: string[];
    presets: (keyof typeof AutoModerationRuleKeywordPresetType)[];
    allow_list: string[];
    mention_total_limit: number;
    /**
     * @warn Only Rust flavored regex is currently supported (Maximum of 75 characters)
     * @link https://discord.com/developers/docs/resources/auto-moderation#auto-moderation-rule-object-trigger-metadata
     * @link https://rustexp.lpil.uk/
     */
    regex_patterns: string[];
}

export interface CreateAndEditAutoModerationRuleActionMetadata {
    channel_id: Snowflake;
    duration_seconds: number;
}

export interface EditAndCreateAutoModerationRuleActionData {
    type: keyof typeof AutoModerationActionType;
    metadata?: CreateAndEditAutoModerationRuleActionMetadata | null;
}

export interface EditAndCreateAutoModerationRuleData {
    name?: string;
    event_type?: AutoModerationRuleEventTypeResolvable;
    trigger_metadata?: EditAndCreateAutoModerationRuleTriggerMetadata;
    actions?: EditAndCreateAutoModerationRuleActionData[];
    enabled?: boolean;
    exempt_roles?: Snowflake[];
    exempt_channels?: Snowflake[];
}

export interface ApplicationCommandPermissionsChildData {
    id: Snowflake;
    type: keyof typeof ApplicationCommandPermissionType;
    permission: boolean;
}

export interface APIApplicationCommandPermissionsChildData
    extends Omit<ApplicationCommandPermissionsChildData, ['type']> {
    type: ApplicationCommandPermissionType;
}

export interface ApplicationCommandPermissionsData {
    id: Snowflake;
    application_id: Snowflake;
    guild_id: Snowflake;
    permissions: ApplicationCommandPermissionsChildData[];
}

export interface APIApplicationCommandPermissionsData
    extends Omit<ApplicationCommandPermissionsData, ['permissions']> {
    permissions: APIApplicationCommandPermissionsChildData[];
}

export interface FetchCommandOptions extends FetchOptions {
    with_localizations?: boolean;
}

export interface ApplicationCommandOptionData {
    type: keyof typeof ApplicationCommandType;
    name: string;
    name_localizations?: LocalizationMap;
    description: string;
    description_localizations?: LocalizationMap;
    required?: boolean;
    choices?: APIApplicationCommandOptionChoice[];
    options?: ApplicationCommandOptionData[];
    channel_types?: ChannelTypeResolvable[];
    min_value?: number;
    max_value?: number;
    min_length?: number;
    max_length?: number;
    autocomplete?: boolean;
}

export interface APIApplicationCommandOptionData {
    type: ApplicationCommandType;
    name: string;
    name_localizations?: LocalizationMap;
    description: string;
    description_localizations?: LocalizationMap;
    required?: boolean;
    choices?: APIApplicationCommandOptionChoice[];
    options?: APIApplicationCommandOptionData[];
    channel_types?: number[];
    min_value?: number;
    max_value?: number;
    min_length?: number;
    max_length?: number;
    autocomplete?: boolean;
}

export interface CreateCommandData {
    name: string;
    name_localizations?: LocalizationMap;
    description: string;
    description_localizations?: LocalizationMap;
    options?: ApplicationCommandOptionData[];
    default_member_permissions?: PermissionFlagsBitsResolvable;
    dm_permission?: boolean;
    type?: ApplicationCommandTypeResolvable;
    nsfw?: boolean;
}

export interface APICreateCommandData {
    name: string;
    name_localizations?: LocalizationMap;
    description: string;
    description_localizations?: LocalizationMap;
    options?: APIApplicationCommandOptionData[];
    default_member_permissions?: string;
    dm_permission?: boolean;
    type?: ApplicationCommandType;
    nsfw?: boolean;
}

export type Omit<T, K extends [...(keyof T)[]]> = Pick<T, Exclude<keyof T, K[number]>>;

export interface EditCommandData extends Omit<CreateCommandData, ['name', 'description', 'type']> {
    name?: string;
    description?: string;
}

export type ThreadTypeResolvable = keyof typeof ThreadType | ThreadType;

export interface StartThreadData {
    name: string;
    auto_archive_duration?: ThreadAutoArchiveDurationResolvable;
    rate_limit_per_user?: number;
    type?: ThreadTypeResolvable;
    applied_tags?: Snowflake[];
    message?: GuildForumChannelThreadMessageParamsData;
    invitable?: boolean;
}

export type AnyMessageComponentInteraction =
    | ButtonInteraction
    | ChannelSelectMenuInteraction
    | MentionableSelectMenuInteraction
    | RoleSelectMenuInteraction
    | UserSelectMenuInteraction
    | StringSelectMenuInteraction;

export type AnyApplicationCommandInteraction =
    | ChatInputCommandInteraction
    | UserCommandInteraction
    | MessageCommandInteraction;

export type AnyInteraction =
    | AnyMessageComponentInteraction
    | AnyApplicationCommandInteraction
    | PingInteraction
    | ModalSubmitInteraction
    | AutocompleteInteraction;

export type APIAnyMessageComponentInteraction =
    | APIMessageComponentButtonInteraction
    | APIMessageComponentSelectMenuInteraction;

export type APIAnyApplicationCommandInteraction =
    | APIChatInputApplicationCommandInteraction
    | APIUserApplicationCommandInteraction
    | APIMessageComponentSelectMenuInteraction;

export type APIAnyInteraction =
    | APIAnyMessageComponentInteraction
    | APIAnyApplicationCommandInteraction
    | APIPingInteraction
    | APIModalSubmitInteraction
    | APIApplicationCommandAutocompleteInteraction;

export interface ModalSubmitComponentData {
    customId: string;
    type: keyof typeof ComponentType;
    value: string;
}

export interface ModalSubmitComponentsData {
    type: keyof typeof ComponentType;
    components: ModalSubmitComponentData[];
}

export interface InteractionWebhookData {
    id: Snowflake;
    token: string;
}

export interface ReplyInteractionData {
    tts?: boolean;
    content?: string;
    embeds?: EmbedData[];
    allowed_mentions?: APIAllowedMentions[];
    flags?: MessageFlagsBitsResolvable;
    components?: APIAnyComponent[];
    attachments?: (MessageAttachmentData | Attachment)[];
    files?: (string | Buffer | FileData)[];
}

export interface CallbackInteractionOptions {
    fetchReply?: boolean;
}

export interface DeferReplyOptions extends CallbackInteractionOptions {
    flags?: MessageFlagsBitsResolvable;
}

export interface ChatInputCommandResolvedOptionsResolvedData {
    attachments: Collection<string, Attachment>;
    channels: Collection<string, InteractionDataResolvedChannel>;
    members: Collection<string, GuildMember>;
    roles: Collection<string, Role>;
    users: Collection<string, User>;
}

export interface ChatInputCommandResolvedOptionsData {
    resolved: ChatInputCommandResolvedOptionsResolvedData;
    options: Collection<string, ChatInputCommandResolvedOptionData>;
}

export interface ChatInputCommandResolvedOptionResolvedData {
    attachment?: Attachment;
    channel?: InteractionDataResolvedChannel;
    member?: GuildMember;
    role?: Role;
    user?: User;
}

export interface ChatInputCommandResolvedOptionData {
    name: string;
    type: keyof typeof ApplicationCommandOptionType;
    value: number | string | boolean;
    options?: Collection<string, ChatInputCommandResolvedOptionData>;
    focusted?: boolean;
    resolved?: ChatInputCommandResolvedOptionResolvedData;
}

export interface AuditLogEntryInfoData {
    applicationId: Snowflake | null;
    channelId: Snowflake | null;
    count: number | null;
    deleteMemberDays: number | null;
    id: Snowflake | null;
    membersRemoved: number | null;
    messageId: Snowflake | null;
    roleName: string | null;
    type: keyof typeof AuditLogOptionsType;
}

export interface AuditLogChangeData {
    key: APIAuditLogChange['key'];
    old: string | number | boolean | Role[] | ChannelOverwriteData[] | null;
    new: string | number | boolean | Role[] | ChannelOverwriteData[] | null;
}

export interface CollectorFilter<T> {
    (element: T): boolean;
}

export type MessageCollectorIgnoreOption =
    | 'bot'
    | 'self'
    | 'messageDelete'
    | 'messageUpdate'
    | 'messageCreate';

export interface CollectorEvents<T> {
    end: [collected: Collection<Snowflake, T>, reason: string];
    collect: [element: T];
    dispose: [element: T];
}

export interface CollectorOptions<T> {
    max?: number;
    time?: number;
    filter?: CollectorFilter<T>;
}

export interface MessageCollectorOptions extends CollectorOptions<Message> {
    ignore?: MessageCollectorIgnoreOption[];
}

export type MessageReactionCollectorIgnoreOption =
    | 'bot'
    | 'self'
    | 'reactionAdd'
    | 'reactionRemove';

export interface MessageReactionCollectorOptions extends CollectorOptions<MessageReaction> {
    ignore?: MessageReactionCollectorIgnoreOption[];
}

export interface MessageComponentCollectorOptions extends CollectorOptions<Message> {
    componentType?: Arrayable<keyof typeof ComponentType>;
}

export type GuildAFKTimeoutResolvable = 60 | 300 | 900 | 1800 | 3600;

export type SelectMenuResolvedValuesResolvedData = Pick<
    ChatInputCommandResolvedOptionsResolvedData,
    'channels' | 'members' | 'roles' | 'users'
>;

export interface SelectMenuResolvedValuesData {
    resolved: SelectMenuResolvedValuesResolvedData;
    values: Collection<string, SelectMenuResolvedOptionData>;
}

export type SelectMenuResolvedValueResolvedData = Pick<
    ChatInputCommandResolvedOptionResolvedData,
    'channel' | 'member' | 'role' | 'user'
>;

export type APISelectMenuInteractionDataResolved = Pick<
    APIInteractionDataResolved,
    'channels' | 'members' | 'roles' | 'users'
>;

export interface SelectMenuResolvedOptionData {
    resolved: SelectMenuResolvedValueResolvedData;
    value: string;
}

export type Promiseable<T> = T | Promise<T>;

export interface ApplicationRoleConnectionMetadata {
    description: string;
    descriptionLocalizations: LocalizationMap;
    key: string;
    name: string;
    nameLocalizations: LocalizationMap;
    type: keyof typeof ApplicationRoleConnectionMetadataType;
}

export type ApplicationRoleConnectionMetadataTypeResolvable =
    | keyof typeof ApplicationRoleConnectionMetadataType
    | ApplicationRoleConnectionMetadataType;

export interface EditApplicationRoleConnectionMetadata {
    description: string;
    description_localizations: LocalizationMap;
    key: string;
    name: string;
    name_localizations: LocalizationMap;
    type: ApplicationRoleConnectionMetadataTypeResolvable;
}

export interface EditApplicationRoleConnectionData {
    platform_name?: string | null;
    platform_username?: string | null;
    metadata?: EditApplicationRoleConnectionMetadata;
}

export interface FetchThreadMemberOptions extends FetchOptions {
    with_member?: boolean;
    after?: Snowflake;
    limit?: number;
}

export type Enum<T> = {
    [key in keyof T]: T[key];
};

export interface PresenceActivityAssets {
    largeImage: string | null;
    largeText: string | null;
    smallImage: string | null;
    smallText: string | null;
}

export interface PresenceActivitySecrets {
    join?: string;
    spectate?: string;
    match?: string;
}

export interface RoleSubscriptionData {
    roleSubscriptionListingId: Snowflake;
    tierName: string;
    totalMonthsSubscribed: number;
    isRenewal: boolean;
}

export interface WebSocketHandlerEvents {
    ready: [client: Client];
    guildCreate: [guild: Guild];
    guildDelete: [guild: Guild];
    guildUpdate: [oldGuild: Guild, newGuild: Guild];
    emojiCreate: [emoji: GuildEmoji];
    emojiDelete: [emoji: GuildEmoji];
    emojiUpdate: [oldEmoji: GuildEmoji, newEmoji: GuildEmoji];
    stickerCreate: [sticker: Sticker];
    stickerDelete: [sticker: Sticker];
    stickerUpdate: [oldSticker: Sticker, newSticker: Sticker];
    roleCreate: [role: Role];
    roleDelete: [role: Role];
    roleUpdate: [oldRole: Role, newRole: Role];
    guildBanAdd: [ban: GuildBan];
    guildBanRemove: [ban: GuildBan];
    presenceUpdate: [oldPresence: Presence, newPresence: Presence];
    guildMemberAdd: [member: GuildMember];
    guildMemberRemove: [member: GuildMember];
    guildMemberUpdate: [oldMember: GuildMember, newMember: GuildMember];
    guildMembersChunk: [
        guild: Guild,
        members: Collection<Snowflake, GuildMember>,
        data: {
            chunkIndex: number;
            chunkCount: number;
            notFound: unknown[];
            nonce: string | null;
        },
    ];
    messageCreate: [message: Message];
    messageDelete: [message: Message];
    messageUpdate: [oldMessage: Message, newMessage: Message];
    channelCreate: [message: AnyChannel];
    channelDelete: [message: AnyChannel];
    channelUpdate: [oldChannel: AnyChannel, newChannel: AnyChannel];
    channelPinsUpdate: [
        channel: GuildTextBasedNonThreadChannelResolvable | DMBasedChannelResolvable,
        data: {
            lastPinTimestamp: number | null;
            lastPinAt: Date | null;
        },
    ];
    scheduledEventCreate: [scheduledEvent: GuildScheduledEvent];
    scheduledEventUserAdd: [scheduledEvent: GuildScheduledEvent, user: User];
    guildScheduledEventUpdate: [
        oldScheduledEvent: GuildScheduledEvent,
        newScheduledEvent: GuildScheduledEvent,
    ];
    messageDeleteBulk: [
        channel: GuildTextBasedChannelResolvable,
        messages: Collection<Snowflake, Message>,
    ];
    integrationUpdate: [oldIntegration: GuildIntegration, newIntegration: GuildIntegration];
    integrationCreate: [integration: GuildIntegration];
    integrationDelete: [integration: GuildIntegration];
    guildIntegrationsUpdate: [guild: Guild];
    messageReactionRemoveAll: [message: Message];
    stageInstanceCreate: [stageInstance: StageInstance];
    stageInstanceDelete: [stageInstance: StageInstance];
    stageInstanceUpdate: [oldStageInstance: StageInstance, newStageInstance: StageInstance];
    threadCreate: [thread: ThreadChannel];
    threadDelete: [thread: ThreadChannel];
    threadUpdate: [oldThread: ThreadChannel, newThread: ThreadChannel];
    threadMemberUpdate: [thread: ThreadChannel, oldMember: ThreadMember, newMember: ThreadMember];
    threadMemberAdd: [thread: ThreadChannel, member: ThreadMember];
    threadMembersUpdate: [
        thread: ThreadChannel,
        addedMembers: Collection<Snowflake, ThreadMember>,
        removedMembers: Collection<Snowflake, ThreadMember>,
    ];
    threadListSync: [syncedThreads: Collection<Snowflake, ThreadChannel>, guild: Guild];
    typingStart: [typing: Typing];
    voiceStateUpdate: [oldState: VoiceState, newState: VoiceState];
    voiceServerUpdate: [guild: Guild, endpoint: string | null, token: string];
    messageReactionAdd: [reaction: MessageReaction];
    messageReactionRemove: [reaction: MessageReaction];
    messageReactionRemoveEmoji: [reaction: MessageReaction];
    userUpdate: [oldUser: User, newUser: User];
    webhooksUpdate: [channel: WebhookableChannelResolvable];
    inviteCreate: [invite: Invite];
    inviteDelete: [guild: Guild, invite: Invite | string];
    interactionCreate: [interaction: AnyInteraction];
    autoModerationRuleCreate: [rule: AutoModerationRule];
    autoModerationRuleUpdate: [oldRule: AutoModerationRule, newRule: AutoModerationRule];
    autoModerationRuleDelete: [rule: AutoModerationRule];
    autoModerationActionExecution: [exception: AutoModerationActionException];
    dispatch: [data: GatewayDispatchPayload];
    receive: [data: GatewayReceivePayload];
    shardClosed: [shard: WebSocketShard, code: number, reason: string];
    shardDeath: [shard: WebSocketShard, code: number, reason: string];
    shardError: [shard: WebSocketShard, error: Error];
    shardReady: [shard: WebSocketShard];
    shardReconnect: [shard: WebSocketShard];
    shardResumed: [shard: WebSocketShard, replayed: number];
    shardSpawn: [shard: WebSocketShard];
    debug: [message: string];
    guildAuditLogEntryCreate: [entry: AuditLogEntry];
}
