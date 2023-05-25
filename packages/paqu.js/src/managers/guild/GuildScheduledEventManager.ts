import {
    type Snowflake,
    type Client,
    type Guild,
    type FetchGuildScheduledEventOptions,
    type APIGuildScheduledEvent,
    type CreateGuildScheduledEventData,
    type EditGuildScheduledEventData,
    type GuildScheduledEventUserData,
    type RESTGetAPIGuildScheduledEventUsersResult,
    User,
    GuildMember,
    GuildScheduledEvent,
} from '../../index';
import { GuildScheduledEventDataResolver } from '@paqujs/resolvers';
import { Collection } from '@paqujs/shared';
import { CachedManager } from '../base/CachedManager';

export class GuildScheduledEventManager extends CachedManager<Snowflake, GuildScheduledEvent> {
    public guild: Guild;

    public constructor(client: Client, guild: Guild) {
        super(client);

        this.guild = guild;
    }

    public async fetch(
        id?: Snowflake,
        { force, with_user_count }: FetchGuildScheduledEventOptions = {
            force: false,
            with_user_count: true,
        },
    ) {
        if (id) {
            let _scheduledEvent = this.cache.get(id)!;

            if (!force && _scheduledEvent) {
                return _scheduledEvent;
            } else {
                const scheduledEvent = await this.client.rest.get<APIGuildScheduledEvent>(
                    `/guilds/${this.guild.id}/scheduled-events/${id}`,
                );

                if (_scheduledEvent) {
                    _scheduledEvent = _scheduledEvent._patch(scheduledEvent);
                }

                return this.cache.setAndReturnValue(
                    scheduledEvent.id,
                    _scheduledEvent ?? new GuildScheduledEvent(this.client, scheduledEvent),
                );
            }
        } else {
            const scheduledEvents = await this.client.rest.get<APIGuildScheduledEvent[]>(
                `/guilds/${this.guild.id}/scheduled-events`,
                {
                    query: { with_user_count },
                },
            );

            const result = new Collection<Snowflake, GuildScheduledEvent>();

            for (const scheduledEvent of scheduledEvents) {
                let _scheduledEvent = this.cache.get(scheduledEvent.id!)!;

                if (_scheduledEvent) {
                    _scheduledEvent = _scheduledEvent._patch(scheduledEvent);
                }

                result.set(
                    scheduledEvent.id,
                    _scheduledEvent ?? new GuildScheduledEvent(this.client, scheduledEvent),
                );
            }

            this.cache.clear();
            this.cache.concat(result);

            return this.cache;
        }
    }

    public async create(data: CreateGuildScheduledEventData, reason?: string) {
        const scheduledEvent = await this.client.rest.post<APIGuildScheduledEvent>(
            `/guilds/${this.guild.id}/emojis`,
            {
                body: GuildScheduledEventDataResolver(data),
                reason: reason as string,
            },
        );

        return this.cache.setAndReturnValue(
            scheduledEvent.id!,
            new GuildScheduledEvent(this.client, scheduledEvent),
        );
    }

    public async edit(id: Snowflake, data: EditGuildScheduledEventData, reason?: string) {
        const scheduledEvent = await this.client.rest.patch<APIGuildScheduledEvent>(
            `/guilds/${this.guild.id}/scheduled-events/${id}`,
            { body: GuildScheduledEventDataResolver(data), reason: reason as string },
        );

        let _scheduledEvent = this.cache.get(id);

        if (_scheduledEvent) {
            _scheduledEvent = _scheduledEvent._patch(scheduledEvent);
        }

        return this.cache.setAndReturnValue(
            scheduledEvent.id!,
            _scheduledEvent ?? new GuildScheduledEvent(this.client, scheduledEvent),
        );
    }

    public async delete(id: Snowflake, reason?: string) {
        await this.client.rest.delete(`/guilds/${this.guild.id}/scheduled-events/${id}`, {
            reason: reason as string,
        });
        this.cache.delete(id);
    }

    public async fetchUsers(
        id: Snowflake,
    ): Promise<Collection<Snowflake, GuildScheduledEventUserData>> {
        const users = await this.client.rest.get<RESTGetAPIGuildScheduledEventUsersResult>(
            `/guilds/${this.guild.id}/scheduled-events/${id}/users`,
        );

        return users.reduce(
            (accumulator, data) =>
                accumulator.set(data.user.id, {
                    guildScheduledEventId: data.guild_scheduled_event_id,
                    user: this.client.caches.users.cache.setAndReturnValue(
                        data.user.id,
                        new User(this.client, data.user),
                    ),
                    member:
                        (data.member &&
                            this.guild.caches.members.cache.setAndReturnValue(
                                data.user.id,
                                new GuildMember(this.client, this.guild, data.member),
                            )) ??
                        null,
                }),
            new Collection<Snowflake, GuildScheduledEventUserData>(),
        );
    }
}
