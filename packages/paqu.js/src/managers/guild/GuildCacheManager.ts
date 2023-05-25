import {
    type Client,
    type Guild,
    type Snowflake,
    type Presence,
    GuildEmojiManager,
    GuildRoleManager,
    GuildStickerManager,
    GuildBanManager,
    GuildMemberManager,
    GuildChannelManager,
    GuildScheduledEventManager,
    GuildStageInstanceManager,
    GuildVoiceStateManager,
    GuildIntegrationManager,
    GuildAutoModerationRuleManager,
    GuildCommandManager,
} from '../../index';
import { Collection } from '@paqujs/shared';
import { BaseManager } from '../base/BaseManager';

export class GuildCacheManager extends BaseManager {
    public guild: Guild;
    public emojis: GuildEmojiManager;
    public roles: GuildRoleManager;
    public stickers: GuildStickerManager;
    public bans: GuildBanManager;
    public members: GuildMemberManager;
    public channels: GuildChannelManager;
    public scheduledEvents: GuildScheduledEventManager;
    public stageInstances: GuildStageInstanceManager;
    public voiceStates: GuildVoiceStateManager;
    public integrations: GuildIntegrationManager;
    public autoModerationRules: GuildAutoModerationRuleManager;
    public commands: GuildCommandManager;
    public presences: Collection<Snowflake, Presence>;

    public constructor(client: Client, guild: Guild) {
        super(client);

        this.guild = guild;

        this.emojis = new GuildEmojiManager(client, guild);
        this.roles = new GuildRoleManager(client, guild);
        this.stickers = new GuildStickerManager(client, guild);
        this.bans = new GuildBanManager(client, guild);
        this.members = new GuildMemberManager(client, guild);
        this.channels = new GuildChannelManager(client, guild);
        this.scheduledEvents = new GuildScheduledEventManager(client, guild);
        this.stageInstances = new GuildStageInstanceManager(client, guild);
        this.voiceStates = new GuildVoiceStateManager(client, guild);
        this.integrations = new GuildIntegrationManager(client, guild);
        this.autoModerationRules = new GuildAutoModerationRuleManager(client, guild);
        this.commands = new GuildCommandManager(client, guild);
        this.presences = new Collection();
    }
}
