import {
    type Client,
    type APIMessageComponentSelectMenuInteraction,
    type APIMessageMentionableSelectInteractionData,
    type Snowflake,
    InteractionDataResolvedChannel,
    GuildMember,
    Role,
    User,
} from '../../index';
import { Collection } from '@paqujs/shared';
import { BaseMessageComponentInteraction } from '../base/BaseMessageComponentInteraction';

export class MentionableSelectMenuInteraction extends BaseMessageComponentInteraction {
    public values!: Collection<
        Snowflake,
        InteractionDataResolvedChannel | GuildMember | Role | User
    >;

    public constructor(
        client: Client,
        data: APIMessageComponentSelectMenuInteraction & {
            data: APIMessageMentionableSelectInteractionData;
        },
    ) {
        super(client, data);

        this._patch(data);
    }

    public override _patch(
        data: APIMessageComponentSelectMenuInteraction & {
            data: APIMessageMentionableSelectInteractionData;
        },
    ) {
        super._patch(data);

        this.values = new Collection();

        for (const member of Object.entries(data.data.resolved.members ?? {})) {
            this.values.set(
                member[0],
                new GuildMember(this.client, this.guild, {
                    ...member[1],
                    user: data.data.resolved.users[member[0]],
                    deaf: false,
                    mute: false,
                }),
            );
        }

        for (const role of Object.entries(data.data.resolved.roles ?? {})) {
            this.values.set(
                role[0],
                this.guild
                    ? this.guild.caches.roles.cache.setAndReturnValue(
                          role[0],
                          new Role(this.client, this.guild, role[1]),
                      )
                    : new Role(this.client, this.guild, role[1]),
            );
        }

        for (const user of Object.entries(data.data.resolved.users ?? {})) {
            this.values.set(
                user[0],
                this.client.caches.users.cache.setAndReturnValue(
                    user[0],
                    new User(this.client, user[1]),
                ),
            );
        }

        return this;
    }
}
