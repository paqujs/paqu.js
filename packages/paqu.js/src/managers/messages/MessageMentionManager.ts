import {
    type APIUser,
    type Snowflake,
    type Client,
    type APIChannelMention,
    type Role,
    type Guild,
    type GuildMember,
    User,
} from '../../index';
import { Collection } from '@paqujs/shared';
import { BaseManager } from '../base/BaseManager';

export class MessageMentionManager extends BaseManager {
    public users: Collection<Snowflake, User>;
    public members: Collection<Snowflake, GuildMember>;
    public roles: Collection<Snowflake, Role>;
    public channels: Collection<Snowflake, any>;
    public everyone: boolean;

    public constructor(
        client: Client,
        userMentions?: APIUser[],
        roleMentions?: Snowflake[],
        channelMentions?: APIChannelMention[],
        everyoneMention?: boolean,
        guild?: Guild,
    ) {
        super(client);

        this.users = new Collection(
            (userMentions ?? []).map((user) => [user.id, new User(client, user)]),
        );
        this.members = new Collection();
        this.roles = new Collection();
        this.channels = new Collection();
        this.everyone = everyoneMention ?? false;

        if (guild) {
            for (const user of userMentions ?? []) {
                const member = guild.caches.members.cache.get(user.id);

                if (member) {
                    this.members.set(user.id, member);
                }
            }

            for (const role of roleMentions ?? []) {
                const _role = guild.caches.roles.cache.get(role);

                if (_role) {
                    this.roles.set(role, _role);
                }
            }

            for (const channel of channelMentions ?? []) {
                const _channel = guild.caches.channels.cache.get(channel.id);

                if (_channel) {
                    this.channels.set(channel.id, _channel);
                }
            }
        }
    }
}
