import {
    type Client,
    type Snowflake,
    type MessageReactionData,
    type APIReaction,
    type Message,
    type FetchReactionOptions,
    type APIUser,
    User,
} from '../../index';
import { EmojiResolver } from '@paqujs/resolvers';
import { Collection } from '@paqujs/shared';
import { CachedManager } from '../base/CachedManager';

export class MessageReactionManager extends CachedManager<Snowflake, MessageReactionData> {
    public message: Message;

    public constructor(client: Client, message: Message, reactions: APIReaction[]) {
        super(client);

        for (const reaction of reactions) {
            if (reaction.emoji.id) {
                this.cache.set(reaction.emoji.id, {
                    count: reaction.count,
                    me: reaction.me,
                    emoji: EmojiResolver(reaction.emoji) as string,
                });
            }
        }

        this.message = message;
    }

    public async fetchUsers(emoji: string, { after, limit }: FetchReactionOptions = { limit: 25 }) {
        const resolved = EmojiResolver(emoji);
        const emojiStr =
            typeof resolved === 'object' ? `${resolved.name}:${resolved.id}` : resolved;

        const users = await this.client.rest.get<APIUser[]>(
            `/channels/${this.message.channelId}/messages/${this.message.id}/reactions/${emojiStr}`,
            {
                query: {
                    limit,
                    after,
                },
            },
        );

        const result = new Collection<Snowflake, User>();

        for (const user of users) {
            result.set(user.id, new User(this.client, user));
        }

        this.client.caches.users.cache.concat(result);

        return result;
    }

    public create(emoji: string) {
        const resolved = EmojiResolver(emoji);
        const emojiStr =
            typeof resolved === 'object' ? `${resolved.name}:${resolved.id}` : resolved;

        return this.client.rest.put<void>(
            `/channels/${this.message.channelId}/messages/${this.message.id}/reactions/${emojiStr}/@me`,
        );
    }

    public delete(emoji: string, userId?: Snowflake | '@me') {
        const resolved = EmojiResolver(emoji);
        const emojiStr =
            typeof resolved === 'object' ? `${resolved.name}:${resolved.id}` : resolved;

        return this.client.rest.delete<void>(
            `/channels/${this.message.channelId}/messages/${
                this.message.id
            }/reactions/${emojiStr}/${userId ?? '@me'}`,
        );
    }

    public deleteAll() {
        return this.client.rest.delete<void>(
            `/channels/${this.message.channelId}/messages/${this.message.id}/reactions`,
        );
    }

    public deleteAllForEmoji(emoji: string) {
        const resolved = EmojiResolver(emoji);
        const emojiStr =
            typeof resolved === 'object' ? `${resolved.name}:${resolved.id}` : resolved;

        return this.client.rest.delete<void>(
            `/channels/${this.message.channelId}/messages/${this.message.id}/reactions/${emojiStr}`,
        );
    }
}
