import {
    type Client,
    type APIGuild,
    type Collectionable,
    type CreateGuildData,
    type Snowflake,
    type RESTAPIPartialCurrentUserGuild,
    type FetchGuildOptions,
    type GuildMFALevelResolvable,
    type GuildFetchPruneOptions,
    type RESTGetAPIGuildPruneCountResult,
    type RESTPostAPIGuildPruneJSONBody,
    type APIVoiceRegion,
    type RESTGetAPIGuildVanityUrlResult,
    type RESTGetAPIGuildWidgetImageResult,
    type RESTGetAPIGuildWidgetSettingsResult,
    type RESTGetAPIGuildWidgetJSONResult,
    type RESTGetAPIGuildPreviewResult,
    type RESTPatchAPIGuildWidgetSettingsJSONBody,
    type RESTPatchAPIGuildWidgetSettingsResult,
    type RESTPatchAPIGuildWelcomeScreenJSONBody,
    type RESTPatchAPIGuildWelcomeScreenResult,
    type RESTGetAPIGuildWelcomeScreenResult,
    type RESTPatchAPIGuildVoiceStateUserJSONBody,
    type EditGuildMeVoiceStateData,
    type APIGuildIntegration,
    type CreateAutoModerationRuleData,
    type EditAutoModerationRuleData,
    type APIAutoModerationRule,
    type APIApplicationCommand,
    type CreateCommandData,
    type EditCommandData,
    type RESTGetAPIApplicationCommandPermissionsResult,
    type ApplicationCommandPermissionsChildData,
    type EditGuildData,
    type FetchCommandOptions,
    type APIAuditLog,
    type APIGuildOnboarding,
    type RESTGetAPIGuildApplicationCommandsPermissionsResult,
    GuildWidgetSettings,
    GuildWidget,
    GuildPreview,
    Guild,
    OAuth2Guild,
    GuildWelcomeScreen,
    UnavailableGuild,
    GuildIntegration,
    AutoModerationRule,
    ApplicationCommand,
    ApplicationCommandPermissions,
    AuditLog,
    CachedManager,
    GuildOnboarding,
} from '../../index';
import { ApplicationCommandPermissionType, GuildMFALevel } from 'discord-api-types/v10';
import { Collection } from '@paqujs/shared';
import { PermissionFlagsBitsResolvable } from '@paqujs/bitfields';
import {
    PermissionFlagsBitsResolver,
    AutoModerationRuleDataResolver,
    GuildDataResolver,
} from '@paqujs/resolvers';

export class ClientGuildManager extends CachedManager<Snowflake, Guild> {
    public unavailables = new Collection<Snowflake, UnavailableGuild>();

    public constructor(client: Client) {
        super(client);
    }

    public async fetch(
        id?: Snowflake | null,
        { with_counts, force }: FetchGuildOptions = { with_counts: true, force: false },
    ): Promise<Collectionable<Snowflake, Guild | OAuth2Guild[]>> {
        if (id) {
            let _guild = this.cache.get(id)!;

            if (!force && _guild) {
                return _guild;
            } else {
                const guild = await this.client.rest.get<APIGuild>(`/guilds/${id}`, {
                    query: { with_counts },
                });

                if (_guild) {
                    _guild = _guild._patch(guild);
                }

                return this.cache.setAndReturnValue(
                    guild.id,
                    _guild ?? new Guild(this.client, guild),
                );
            }
        } else {
            const guilds = await this.client.rest.get<RESTAPIPartialCurrentUserGuild[]>(
                '/users/@me/guilds',
            );

            return guilds.map((guild) => new OAuth2Guild(this.client, guild));
        }
    }

    public async create(data: CreateGuildData): Promise<Guild> {
        const guild = await this.client.rest.post<APIGuild>('/guilds', {
            body: GuildDataResolver(data),
        });

        return this.cache.setAndReturnValue(guild.id, new Guild(this.client, guild));
    }

    public delete(id: Snowflake) {
        this.cache.delete(id);
        return this.client.rest.delete<void>(`/guilds/${id}`);
    }

    public leave(id: Snowflake) {
        this.cache.delete(id);
        return this.client.rest.delete<void>(`/users/@me/guilds/${id}`);
    }

    public async edit(id: Snowflake, data: EditGuildData, reason?: string): Promise<Guild> {
        const guild = await this.client.rest.patch<APIGuild>(`/guilds/${id}`, {
            body: GuildDataResolver(data),
            reason: reason as string,
        });

        let _guild = this.cache.get(id)!;

        if (_guild) {
            _guild = _guild._patch(guild);
        }

        return this.cache.setAndReturnValue(guild.id, _guild ?? new Guild(this.client, guild));
    }

    public async setMFALevel(id: Snowflake, level: GuildMFALevelResolvable) {
        await this.client.rest.put(`/guilds/${id}/mfa`, {
            body: {
                level: typeof level === 'number' ? level : GuildMFALevel[level],
            },
        });
    }

    public async fetchPruneCount(
        id: Snowflake,
        { days, includeRoles }: GuildFetchPruneOptions = { days: 7, includeRoles: 'none' },
    ) {
        const { pruned } = await this.client.rest.get<RESTGetAPIGuildPruneCountResult>(
            `/guilds/${id}/prune?days=${days}&include_roles=${
                Array.isArray(includeRoles) ? includeRoles.join(',') : 'none'
            }`,
        );

        return pruned;
    }

    public async pruneMembers(
        id: Snowflake,
        { days, include_roles, compute_prune_count }: RESTPostAPIGuildPruneJSONBody = {
            days: 7,
            compute_prune_count: true,
        },
        reason?: string,
    ) {
        await this.client.rest.post(`/guilds/${id}/prune`, {
            body: { days, include_roles, compute_prune_count },
            reason: reason as string,
        });
    }

    public async fetchPreview(id: Snowflake) {
        const preview = await this.client.rest.get<RESTGetAPIGuildPreviewResult>(
            `/guilds/${id}/preview`,
        );

        return new GuildPreview(this.client, preview);
    }

    public fetchVoiceRegions(id: Snowflake) {
        return this.client.rest.get<APIVoiceRegion>(`/guilds/${id}/regions`);
    }

    public fetchWidgetImage(id: Snowflake) {
        return this.client.rest.get<RESTGetAPIGuildWidgetImageResult>(`/guilds/${id}/widget.png`);
    }

    public async fetchWidgetSettings(id: Snowflake) {
        const widgetSettings = await this.client.rest.get<RESTGetAPIGuildWidgetSettingsResult>(
            `/guilds/${id}/widget.json`,
        );

        return new GuildWidgetSettings(this.client, id, widgetSettings);
    }

    public async fetchWidget(id: Snowflake) {
        const widget = await this.client.rest.get<RESTGetAPIGuildWidgetJSONResult>(
            `/guilds/${id}/widget`,
        );

        return new GuildWidget(this.client, id, widget);
    }

    public fetchVanityURL(id: Snowflake) {
        return this.client.rest.get<RESTGetAPIGuildVanityUrlResult>(`/guilds/${id}/vanity-url`);
    }

    public async fetchWelcomeScreen(id: Snowflake) {
        const welcomeScreen = await this.client.rest.get<RESTGetAPIGuildWelcomeScreenResult>(
            `/guilds/${id}/welcome-screen`,
        );

        return new GuildWelcomeScreen(this.client, id, welcomeScreen);
    }

    public async editWidget(
        id: Snowflake,
        data: RESTPatchAPIGuildWidgetSettingsJSONBody,
        reason?: string,
    ) {
        const widget = await this.client.rest.patch<RESTPatchAPIGuildWidgetSettingsResult>(
            `/guilds/${id}/widget`,
            {
                body: data,
                reason: reason as string,
            },
        );

        return new GuildWidgetSettings(this.client, id, widget);
    }

    public async editWelcomeScreen(
        id: Snowflake,
        data: RESTPatchAPIGuildWelcomeScreenJSONBody,
        reason?: string,
    ) {
        const welcomeScreen = await this.client.rest.patch<RESTPatchAPIGuildWelcomeScreenResult>(
            `/guilds/${id}/welcome-screen`,
            {
                body: data,
                reason: reason as string,
            },
        );

        return new GuildWelcomeScreen(this.client, id, welcomeScreen);
    }

    public fetchWebhooks(id: Snowflake) {
        return this.client.caches.webhooks.fetchGuildWebhooks(id);
    }

    public editVoiceStateUser(
        guildId: Snowflake,
        userId: Snowflake,
        data: RESTPatchAPIGuildVoiceStateUserJSONBody,
    ) {
        return this.client.rest.patch<void>(`/guilds/${guildId}/voice-states/${userId}`, {
            body: data,
        });
    }

    public editMeVoiceState(guildId: Snowflake, data: EditGuildMeVoiceStateData) {
        (data as any).request_to_speak_timestamp &&= new Date(
            data.request_to_speak_timestamp,
        ).toISOString();

        return this.client.rest.patch<void>(`/guilds/${guildId}/voice-states/@me`, {
            body: data,
        });
    }

    public async fetchIntegrations(
        id: Snowflake,
    ): Promise<Collection<Snowflake, GuildIntegration>> {
        const integrations = await this.client.rest.get<APIGuildIntegration[]>(
            `/guilds/${id}/integrations`,
        );

        const guild = this.cache.get(id)!;
        const result = new Collection<Snowflake, GuildIntegration>();

        for (const integration of integrations) {
            result.set(integration.id, new GuildIntegration(this.client, guild!, integration));
        }

        return result;
    }

    public deleteIntegration(guildId: Snowflake, integrationId: Snowflake, reason?: string) {
        return this.client.rest.delete<void>(`/guilds/${guildId}/integrations/${integrationId}`, {
            reason: reason as string,
        });
    }

    public deleteAutoModerationRule(guildId: Snowflake, ruleId: Snowflake, reason?: string) {
        return this.client.rest.delete<void>(`/guilds/${guildId}/auto-moderation/rules/${ruleId}`, {
            reason: reason,
        });
    }

    public async createAutoModerationRule(
        id: Snowflake,
        data: CreateAutoModerationRuleData,
        reason?: string,
    ) {
        const rule = await this.client.rest.post<APIAutoModerationRule>(
            `/guilds/${id}/auto-moderation/rules`,
            {
                body: AutoModerationRuleDataResolver(data),
                reason: reason,
            },
        );

        return new AutoModerationRule(this.client, rule);
    }

    public async editAutoModerationRule(
        guildId: Snowflake,
        ruleId: Snowflake,
        data: EditAutoModerationRuleData,
        reason?: string,
    ) {
        const rule = await this.client.rest.patch<APIAutoModerationRule>(
            `/guilds/${guildId}/auto-moderation/rules/${ruleId}`,
            {
                body: AutoModerationRuleDataResolver(data),
                reason: reason,
            },
        );

        return new AutoModerationRule(this.client, rule);
    }

    public async fetchAutoModerationRules(
        guildId: Snowflake,
        ruleId?: Snowflake,
    ): Promise<Collectionable<Snowflake, AutoModerationRule>> {
        if (ruleId) {
            const rule = await this.client.rest.get<APIAutoModerationRule>(
                `/guilds/${guildId}/auto-moderation/rules/${ruleId}`,
            );

            return new AutoModerationRule(this.client, rule);
        } else {
            const rules = await this.client.rest.get<APIAutoModerationRule[]>(
                `/guilds/${guildId}/auto-moderation/rules`,
            );

            const result = new Collection<Snowflake, AutoModerationRule>();

            for (const rule of rules) {
                result.set(rule.id, new AutoModerationRule(this.client, rule));
            }

            return result;
        }
    }

    public async createCommand(id: Snowflake, data: CreateCommandData) {
        if (data.default_member_permissions) {
            (data as any).default_member_permissions = PermissionFlagsBitsResolver(
                data.default_member_permissions as PermissionFlagsBitsResolvable,
            ).toString();
        }

        const command = await this.client.rest.post<APIApplicationCommand>(
            `/applications/${this.client.user!.id}/guilds/${id}/commands`,
            { body: data },
        );

        return new ApplicationCommand(this.client, command);
    }

    public async editCommand(guildId: Snowflake, commandId: Snowflake, data: EditCommandData) {
        const command = await this.client.rest.patch<APIApplicationCommand>(
            `/applications/${this.client.user!.id}/guilds/${guildId}/commands/${commandId}`,
            { body: data },
        );

        return new ApplicationCommand(this.client, command);
    }

    public deleteCommand(guildId: Snowflake, commandId: Snowflake) {
        return this.client.rest.delete<void>(
            `/applications/${this.client.user!.id}/guilds/${guildId}/commands/${commandId}`,
        );
    }

    public async setCommands(guildId: Snowflake, commands: CreateCommandData[]) {
        const result = await this.client.rest.put<APIApplicationCommand[]>(
            `/applications/${this.client.user!.id}/guilds/${guildId}/commands`,
            { body: commands },
        );

        const collection = new Collection<Snowflake, ApplicationCommand>(
            result.map((command) => [command.id, new ApplicationCommand(this.client, command)]),
        );

        return collection;
    }

    public async fetchCommands(
        guildId: Snowflake,
        commandId?: Snowflake | null,
        { with_localizations }: Partial<FetchCommandOptions> = {
            with_localizations: false,
        },
    ): Promise<Collectionable<Snowflake, ApplicationCommand>> {
        if (commandId) {
            const command = await this.client.rest.get<APIApplicationCommand>(
                `/applications/${this.client.user!.id}/guilds/${guildId}/commands/${commandId}`,
            );

            return new ApplicationCommand(this.client, command);
        } else {
            const commands = await this.client.rest.get<APIApplicationCommand[]>(
                `/applications/${this.client.user!.id}/guilds/${guildId}/commands`,
                {
                    query: {
                        with_localizations,
                    },
                },
            );

            return new Collection<Snowflake, ApplicationCommand>(
                commands.map((command) => [
                    command.id,
                    new ApplicationCommand(this.client, command),
                ]),
            );
        }
    }

    public async fetchCommandPermissions(
        guildId: Snowflake,
        commandId?: Snowflake,
    ): Promise<Collectionable<Snowflake, ApplicationCommandPermissions>> {
        if (commandId) {
            const permissions =
                await this.client.rest.get<RESTGetAPIApplicationCommandPermissionsResult>(
                    `/applications/${
                        this.client.user!.id
                    }/guilds/${guildId}/commands/${commandId}/permissions`,
                );

            return new ApplicationCommandPermissions(permissions);
        }

        const permissions =
            await this.client.rest.get<RESTGetAPIGuildApplicationCommandsPermissionsResult>(
                `/applications/${this.client.user!.id}/guilds/${guildId}/commands/permissions`,
            );

        return new Collection<Snowflake, ApplicationCommandPermissions>(
            permissions.map((permission) => [
                permission.id,
                new ApplicationCommandPermissions(permission),
            ]),
        );
    }

    public async setCommandPermissions(
        guildId: Snowflake,
        commandId: Snowflake,
        token: string,
        data: ApplicationCommandPermissionsChildData[],
    ) {
        for (const permission of data) {
            if (typeof permission.type !== 'number') {
                permission.type = ApplicationCommandPermissionType[
                    permission.type
                ] as unknown as keyof typeof ApplicationCommandPermissionType;
            }
        }

        const permissions =
            await this.client.rest.put<RESTGetAPIApplicationCommandPermissionsResult>(
                `/applications/${
                    this.client.user!.id
                }/guilds/${guildId}/commands/${commandId}/permissions`,
                {
                    body: { permissions: data },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

        return new ApplicationCommandPermissions(permissions);
    }

    public async fetchAuditLogs(id: Snowflake): Promise<AuditLog | void> {
        const guild = this.cache.get(id);

        if (!guild) {
            return undefined;
        }

        const auditLogs = await this.client.rest.get<APIAuditLog>(`/guilds/${id}/audit-logs`);
        return new AuditLog(this.client, guild, auditLogs);
    }

    public async fetchOnboarding(id: Snowflake) {
        const onboarding = await this.client.rest.get<APIGuildOnboarding>(
            `/guilds/${id}/onboarding`,
        );

        return new GuildOnboarding(this.client, onboarding);
    }
}
