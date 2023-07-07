import {
    type APIGuildOnboarding,
    type Snowflake,
    GuildOnboardingPromptType,
} from 'discord-api-types/v10';
import { BaseStructure, type Client, type GuildOnboardingPrompt } from '../../index';
import { Collection } from '@paqujs/shared';
import { GuildBasedChannelResolvable } from '../../../dist';

export class GuildOnboarding extends BaseStructure {
    public defaultChannelIds!: Snowflake[];
    public enabled: boolean;
    public guildId: Snowflake;
    public prompts!: GuildOnboardingPrompt[];

    public constructor(client: Client, data: APIGuildOnboarding) {
        super(client);

        this._patch(data);
    }

    public _patch(data: APIGuildOnboarding) {
        this.defaultChannelIds = data.default_channel_ids;
        this.enabled = data.enabled;
        this.guildId = data.guild_id;
        this.prompts = data.prompts.map((prompt) => ({
            id: prompt.id,
            inOnboarding: prompt.in_onboarding,
            options: prompt.options.map((option) => ({
                id: option.id,
                channelIds: option.channel_ids,
                roleIds: option.role_ids,
                emoji: option.emoji,
                title: option.title,
                description: option.description,
            })),
            required: prompt.required,
            singleSelect: prompt.single_select,
            title: prompt.title,
            type: GuildOnboardingPromptType[prompt.type] as keyof typeof GuildOnboardingPromptType,
        }));

        return this;
    }

    public get guild() {
        return this.client.caches.guilds.cache.get(this.guildId);
    }

    public get defaultChannels() {
        return this.defaultChannelIds.reduce((channels, id) => {
            const channel = this.client.caches.channels.cache.get(
                id,
            ) as any as GuildBasedChannelResolvable;

            if (channel) {
                channels.set(id, channel);
            }

            return channels;
        }, new Collection<Snowflake, GuildBasedChannelResolvable>());
    }
}
