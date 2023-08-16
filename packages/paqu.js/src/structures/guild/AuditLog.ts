import {
    type Client,
    type APIAuditLog,
    type APIThreadChannel,
    type Snowflake,
    type APIAutoModerationRule,
    ApplicationCommand,
    GuildScheduledEvent,
    GuildIntegration,
    ThreadChannel,
    Guild,
    User,
    Webhook,
    AuditLogEntry,
    AutoModerationRule,
} from '../../index';
import { Collection } from '@paqujs/shared';
import { BaseStructure } from '../base/BaseStructure';

export class AuditLog extends BaseStructure {
    public applicationCommands!: Collection<Snowflake, ApplicationCommand>;
    public guildScheduledEvents!: Collection<Snowflake, GuildScheduledEvent>;
    public integrations!: Collection<Snowflake, GuildIntegration>;
    public threads!: Collection<Snowflake, ThreadChannel>;
    public users!: Collection<Snowflake, User>;
    public webhooks!: Collection<Snowflake, Webhook>;
    public autoModerationRules!: Collection<Snowflake, AutoModerationRule>;
    public entries!: Collection<Snowflake, AuditLogEntry>;
    public guild!: Guild;

    public constructor(client: Client, guild: Guild, data: APIAuditLog) {
        super(client);

        this.guild = guild;

        this._patch(data);
    }

    public override _patch(data: APIAuditLog) {
        this.applicationCommands = new Collection(
            data.application_commands.map((command) => [
                command.id,
                this.guild.caches.commands.cache.setAndReturnValue(
                    command.id,
                    new ApplicationCommand(this.client, command),
                ),
            ]),
        );

        this.guildScheduledEvents = new Collection(
            data.guild_scheduled_events.map((event) => [
                event.id,
                this.guild.caches.scheduledEvents.cache.setAndReturnValue(
                    event.id,
                    new GuildScheduledEvent(this.client, event),
                ),
            ]),
        );

        this.integrations = new Collection(
            data.integrations.map((integration) => [
                integration.id,
                this.guild.caches.integrations.cache.setAndReturnValue(
                    integration.id,
                    new GuildIntegration(this.client, this.guild, integration),
                ),
            ]),
        );

        this.threads = new Collection(
            data.threads.map((thread) => [
                thread.id,
                this.guild.caches.channels.cache.setAndReturnValue(
                    thread.id,
                    this.client.caches.channels.cache.setAndReturnValue(
                        thread.id,
                        new ThreadChannel(this.client, this.guild, thread as APIThreadChannel),
                    ) as ThreadChannel,
                ) as ThreadChannel,
            ]),
        );

        this.users = new Collection(
            data.users.map((user) => [
                user.id,
                this.client.caches.users.cache.setAndReturnValue(
                    user.id,
                    new User(this.client, user),
                ),
            ]),
        );

        this.webhooks = new Collection(
            data.webhooks.map((webhook) => [
                webhook.id,
                this.client.caches.webhooks.cache.setAndReturnValue(
                    webhook.id,
                    new Webhook(this.client, webhook),
                ),
            ]),
        );

        this.autoModerationRules = new Collection(
            ((data as any).auto_moderation_rules as APIAutoModerationRule[]).map((webhook) => [
                webhook.id,
                this.guild.caches.autoModerationRules.cache.setAndReturnValue(
                    webhook.id,
                    new AutoModerationRule(this.client, webhook),
                ),
            ]),
        );

        this.entries = new Collection(
            data.audit_log_entries.map((entry) => [
                entry.id,
                new AuditLogEntry(this.client, this.guild, entry),
            ]),
        );

        return this;
    }

    public fetch() {
        return this.guild.fetchAuditLogs();
    }
}
