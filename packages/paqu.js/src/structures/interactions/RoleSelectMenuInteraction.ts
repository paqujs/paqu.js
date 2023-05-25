import {
    type Client,
    type APIMessageComponentSelectMenuInteraction,
    type APIMessageRoleSelectInteractionData,
    type Snowflake,
    Role,
} from '../../index';
import { Collection } from '@paqujs/shared';
import { BaseMessageComponentInteraction } from '../base/BaseMessageComponentInteraction';

export class RoleSelectMenuInteraction extends BaseMessageComponentInteraction {
    public values!: Collection<Snowflake, Role>;

    public constructor(
        client: Client,
        data: APIMessageComponentSelectMenuInteraction & {
            data: APIMessageRoleSelectInteractionData;
        },
    ) {
        super(client, data);

        this._patch(data);
    }

    public override _patch(
        data: APIMessageComponentSelectMenuInteraction & {
            data: APIMessageRoleSelectInteractionData;
        },
    ) {
        super._patch(data);

        this.values = new Collection();

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

        return this;
    }
}
