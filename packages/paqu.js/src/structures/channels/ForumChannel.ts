import {
    type Client,
    type APIGuildForumChannel,
    type Guild,
    type Snowflake,
    type GuildForumChannelTagData,
    type GuildForumChannelDefaultReactionEmojiData,
    type FetchOptions,
    GuildEmoji,
} from '../../index';
import { SortOrderType, ForumLayoutType } from 'discord-api-types/v10';
import { Collection } from '@paqujs/shared';
import { TextChannel } from './TextChannel';

export class ForumChannel extends TextChannel {
    public availableTags!: Collection<Snowflake, GuildForumChannelTagData>;
    public appliedTags!: Snowflake[];
    public defaultReactionEmoji!: GuildForumChannelDefaultReactionEmojiData | null;
    public defaultSortOrder!: keyof typeof SortOrderType;
    public defaultThreadRateLimitPerUser!: number;
    public defaultForumLayout!: ForumLayoutType;

    public constructor(client: Client, guild: Guild, data: APIGuildForumChannel) {
        super(client, guild, data);

        this._patch(data);
    }

    public override _patch(data: APIGuildForumChannel) {
        super._patch(data as any);

        this.availableTags = new Collection(
            data.available_tags
                ? data.available_tags.map((tag) => [
                      tag.id,
                      {
                          id: tag.id,
                          name: tag.name,
                          moderated: tag.moderated,
                          emojiId: tag.emoji_id,
                          emojiName: tag.emoji_name ?? null,
                      },
                  ])
                : [],
        );

        this.appliedTags = (data as any).applied_tags ?? [];
        this.defaultReactionEmoji = data.default_reaction_emoji
            ? {
                  emojiId: data.default_reaction_emoji.emoji_id,
                  emojiName: data.default_reaction_emoji.emoji_name,
              }
            : null;

        this.defaultSortOrder = SortOrderType[
            data.default_sort_order ?? 'LatestActivity'
        ] as keyof typeof SortOrderType;
        this.defaultThreadRateLimitPerUser = data.default_thread_rate_limit_per_user ?? 0;
        this.defaultForumLayout = ForumLayoutType[
            data.default_forum_layout ?? 'NotSet'
        ] as ForumLayoutType;

        return this;
    }

    public async fetchDefaultReactionEmoji(options?: FetchOptions) {
        const emoji = (await this.guild.caches.emojis.fetch(
            this.defaultReactionEmoji!.emojiId,
            options,
        )) as GuildEmoji;

        this.defaultReactionEmoji = {
            emojiId: emoji.id,
            emojiName: emoji.name,
        };

        return emoji;
    }
}
