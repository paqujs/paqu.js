import type {
    Client,
    GatewayAutoModerationActionExecutionDispatchData,
    AutoModerationRuleActionData,
    Snowflake,
    GuildBasedMessageableChannelResolvable,
} from '../../index';
import { AutoModerationActionType, AutoModerationRuleTriggerType } from 'discord-api-types/v10';

import { BaseStructure } from '../base/BaseStructure';

export class AutoModerationActionException extends BaseStructure {
    public action!: AutoModerationRuleActionData | null;
    public alertSystemMessageId!: Snowflake | null;
    public channelId!: Snowflake | null;
    public content!: string | null;
    public guildId!: Snowflake;
    public matchedContent!: string;
    public matchedKeyword!: string;
    public messageId!: Snowflake | null;
    public ruleId!: Snowflake;
    public ruleTriggerType!: keyof typeof AutoModerationRuleTriggerType;
    public userId!: Snowflake;

    public constructor(client: Client, data: GatewayAutoModerationActionExecutionDispatchData) {
        super(client);

        this._patch(data);
    }

    public override _patch(data: GatewayAutoModerationActionExecutionDispatchData): this {
        this.action = {
            metadata: data.action.metadata
                ? {
                      channelId: data.action.metadata.channel_id,
                      durationSeconds: data.action.metadata.duration_seconds,
                  }
                : null,
            type: AutoModerationActionType[
                data.action.type
            ] as keyof typeof AutoModerationActionType,
        };
        this.alertSystemMessageId = data.alert_system_message_id ?? null;
        this.channelId = data.channel_id ?? null;
        this.content = data.content;
        this.guildId = data.guild_id;
        this.matchedContent = data.matched_content;
        this.matchedKeyword = data.matched_keyword;
        this.messageId = data.message_id ?? null;
        this.ruleId = data.rule_id;
        this.ruleTriggerType = AutoModerationRuleTriggerType[
            data.rule_trigger_type
        ] as keyof typeof AutoModerationRuleTriggerType;
        this.userId = data.user_id;

        return this;
    }

    public get guild() {
        return this.client.caches.guilds.cache.get(this.guildId);
    }

    public get rule() {
        return this.guild && this.guild.caches.autoModerationRules.cache.get(this.ruleId);
    }

    public get user() {
        return this.client.caches.users.cache.get(this.userId);
    }

    public get channel() {
        return this.client.caches.channels.cache.get(
            this.channelId,
        ) as GuildBasedMessageableChannelResolvable;
    }

    public get message() {
        return this.channel.caches.messages.cache.get(this.messageId);
    }

    public get alertSystemMessage() {
        return this.channel.caches.messages.cache.get(this.alertSystemMessageId);
    }
}
