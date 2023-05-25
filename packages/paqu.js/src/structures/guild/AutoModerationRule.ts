import type {
    Client,
    Snowflake,
    APIAutoModerationRule,
    AutoModerationRuleActionData,
    AutoModerationRuleTriggerMetadata,
    EditAndCreateAutoModerationRuleData,
    FetchOptions,
} from '../../index';
import {
    AutoModerationRuleEventType,
    AutoModerationActionType,
    AutoModerationRuleTriggerType,
    AutoModerationRuleKeywordPresetType,
} from 'discord-api-types/v10';
import { BaseStructure } from '../base/BaseStructure';

export class AutoModerationRule extends BaseStructure {
    public actions!: AutoModerationRuleActionData[];
    public authorId!: Snowflake;
    public id!: Snowflake;
    public guildId!: Snowflake;
    public enabled!: boolean;
    public eventType!: keyof typeof AutoModerationRuleEventType;
    public exemptChannelsIds!: Snowflake[];
    public exemptRolesIds!: Snowflake[];
    public name!: string;
    public triggerMetadata!: AutoModerationRuleTriggerMetadata;
    public triggerType!: keyof typeof AutoModerationRuleTriggerType;

    public constructor(client: Client, data: APIAutoModerationRule) {
        super(client);

        this._patch(data);
    }

    public override _patch(data: APIAutoModerationRule) {
        this.actions = [];
        this.authorId = data.creator_id;
        this.enabled = data.enabled;
        this.eventType = AutoModerationRuleEventType[
            data.event_type
        ] as keyof typeof AutoModerationRuleEventType;
        this.exemptChannelsIds = data.exempt_channels;
        this.exemptRolesIds = data.exempt_roles;
        this.guildId = data.guild_id;
        this.id = data.id;
        this.name = data.name;
        this.triggerMetadata = {
            allowList: data.trigger_metadata.allow_list ?? [],
            keywordFilter: data.trigger_metadata.keyword_filter ?? [],
            mentionTotalLimit: data.trigger_metadata.mention_total_limit ?? 0,
            presets: data.trigger_metadata.presets
                ? data.trigger_metadata.presets.map(
                      (preset) =>
                          AutoModerationRuleKeywordPresetType[
                              preset
                          ] as keyof typeof AutoModerationRuleKeywordPresetType,
                  )
                : [],
            regexPatterns: data.trigger_metadata.regex_patterns ?? [],
        };
        this.triggerType = AutoModerationRuleTriggerType[
            data.trigger_type
        ] as keyof typeof AutoModerationRuleTriggerType;

        for (const action of data.actions) {
            this.actions.push({
                metadata: action.metadata
                    ? {
                          channelId: action.metadata.channel_id,
                          durationSeconds: action.metadata.duration_seconds,
                      }
                    : null,
                type: AutoModerationActionType[
                    action.type
                ] as keyof typeof AutoModerationActionType,
            });
        }

        return this;
    }

    public get guild() {
        return this.client.caches.guilds.cache.get(this.guildId);
    }

    public get author() {
        return this.client.caches.users.cache.get(this.authorId);
    }

    public get exemptRoles() {
        return this.guild!.caches.roles.cache.filter((role) =>
            this.exemptRolesIds.includes(role.id),
        );
    }

    public get exemptChannels() {
        return this.guild!.caches.channels.cache.filter((channel) =>
            this.exemptChannelsIds.includes(channel.id),
        );
    }

    public async delete(reason?: string) {
        return await this.guild?.caches.autoModerationRules.delete(this.id, reason);
    }

    public async edit(data: EditAndCreateAutoModerationRuleData, reason?: string) {
        return await this.guild?.caches.autoModerationRules.edit(this.id, data, reason);
    }

    public async fetch(options?: FetchOptions) {
        return (await this.guild?.caches.autoModerationRules.fetch(
            this.id,
            options,
        )) as AutoModerationRule;
    }
}
