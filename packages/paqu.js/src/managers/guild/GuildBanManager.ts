import {
    type Client,
    type Snowflake,
    type Guild,
    type Collectionable,
    type APIBan,
    type FetchBanOptions,
    type CreateBanOptions,
    GuildBan,
} from '../../index';
import { Collection } from '@paqujs/shared';
import { CachedManager } from '../base/CachedManager';

export class GuildBanManager extends CachedManager<Snowflake, GuildBan> {
    public guild: Guild;

    public constructor(client: Client, guild: Guild) {
        super(client);

        this.guild = guild;
    }

    public async fetch(
        id?: Snowflake | null,
        { force, limit, before, after }: FetchBanOptions = {
            force: false,
            limit: 1000,
            before: null as unknown as string,
            after: null as unknown as string,
        },
    ): Promise<Collectionable<Snowflake, GuildBan>> {
        if (id) {
            let _ban = this.cache.get(id)!;

            if (!force && _ban) {
                return _ban;
            } else {
                const ban = await this.client.rest.get<APIBan>(
                    `/guilds/${this.guild.id}/emojis/${id}`,
                );

                if (_ban) {
                    _ban = _ban._patch(ban);
                }

                return this.cache.setAndReturnValue(
                    ban.user.id!,
                    _ban ?? new GuildBan(this.client, this.guild, ban),
                );
            }
        } else {
            const bans = await this.client.rest.get<APIBan[]>(`/guilds/${this.guild.id}/bans`, {
                query: { limit, before, after },
            });

            const result = new Collection<Snowflake, GuildBan>();

            for (const ban of bans) {
                let _ban = this.cache.get(ban.user.id!)!;

                if (_ban) {
                    _ban = _ban._patch(ban);
                }

                result.set(ban.user.id, _ban ?? new GuildBan(this.client, this.guild, ban));
            }

            this.cache.clear();
            this.cache.concat(result);

            return this.cache;
        }
    }

    public async create(
        id: Snowflake,
        { delete_message_days, delete_message_seconds, reason }: CreateBanOptions = {},
    ) {
        const ban = await this.client.rest.put<APIBan>(`/guilds/${this.guild.id}/bans/${id}`, {
            body: { delete_message_days, delete_message_seconds },
            reason: reason as string,
        });

        return this.cache.setAndReturnValue(
            ban.user.id,
            new GuildBan(this.client, this.guild, ban),
        );
    }

    public async remove(id: Snowflake, reason?: string) {
        this.cache.delete(id);

        return await this.client.rest.delete<void>(`/guilds/${this.guild.id}/bans/${id}`, {
            reason: reason as string,
        });
    }
}
