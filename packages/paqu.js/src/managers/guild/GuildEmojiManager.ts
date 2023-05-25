import {
    type Client,
    type Snowflake,
    type Guild,
    type Collectionable,
    type APIEmoji,
    type FetchOptions,
    type CreateEmojiData,
    type EditEmojiData,
    GuildEmoji,
} from '../../index';
import { DataResolver } from '@paqujs/resolvers';
import { Collection } from '@paqujs/shared';
import { CachedManager } from '../base/CachedManager';

export class GuildEmojiManager extends CachedManager<Snowflake, GuildEmoji> {
    public guild: Guild;

    public constructor(client: Client, guild: Guild) {
        super(client);

        this.guild = guild;
    }

    public async fetch(
        id?: Snowflake | null,
        { force }: FetchOptions = { force: false },
    ): Promise<Collectionable<Snowflake, GuildEmoji>> {
        if (id) {
            let _emoji = this.cache.get(id)!;

            if (!force && _emoji) {
                return _emoji;
            } else {
                const emoji = await this.client.rest.get<APIEmoji>(
                    `/guilds/${this.guild.id}/emojis/${id}`,
                );

                if (_emoji) {
                    _emoji = _emoji._patch(emoji);
                }

                return this.cache.setAndReturnValue(
                    emoji.id!,
                    _emoji ?? new GuildEmoji(this.client, this.guild, emoji),
                );
            }
        } else {
            const emojis = await this.client.rest.get<APIEmoji[]>(
                `/guilds/${this.guild.id}/emojis`,
            );

            const result = new Collection<Snowflake, GuildEmoji>();

            for (const emoji of emojis) {
                let _emoji = this.cache.get(emoji.id!);

                if (_emoji) {
                    _emoji = _emoji._patch(emoji);
                }

                this.cache.set(emoji.id!, _emoji ?? new GuildEmoji(this.client, this.guild, emoji));
            }

            this.cache.clear();
            this.cache.concat(result);

            return this.cache;
        }
    }

    public async create(data: CreateEmojiData, reason?: string) {
        const resolvedImage = await DataResolver.resolveImage(data.image);

        data.image = resolvedImage;

        const emoji = await this.client.rest.post<APIEmoji>(`/guilds/${this.guild.id}/emojis`, {
            body: data,
            reason: reason as string,
        });

        return this.cache.setAndReturnValue(
            emoji.id!,
            new GuildEmoji(this.client, this.guild, emoji),
        );
    }

    public async delete(id: Snowflake, reason?: string) {
        await this.client.rest.delete(`/guilds/${this.guild.id}/emojis/${id}`, {
            reason: reason as string,
        });
        this.cache.delete(id);
    }

    public async edit(id: Snowflake, data: EditEmojiData, reason?: string) {
        const emoji = await this.client.rest.patch<APIEmoji>(
            `/guilds/${this.guild.id}/emojis/${id}`,
            { body: data, reason: reason as string },
        );

        let _emoji = this.cache.get(id);

        if (_emoji) {
            _emoji = _emoji._patch(emoji);
        }

        return this.cache.setAndReturnValue(
            emoji.id!,
            _emoji ?? new GuildEmoji(this.client, this.guild, emoji),
        );
    }
}
