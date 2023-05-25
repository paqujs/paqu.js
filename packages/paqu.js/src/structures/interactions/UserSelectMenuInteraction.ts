import {
    type Client,
    type APIMessageComponentSelectMenuInteraction,
    type APIMessageUserSelectInteractionData,
    type Snowflake,
    User,
} from '../../index';
import { Collection } from '@paqujs/shared';
import { BaseMessageComponentInteraction } from '../base/BaseMessageComponentInteraction';

export class UserSelectMenuInteraction extends BaseMessageComponentInteraction {
    public values!: Collection<Snowflake, User>;

    public constructor(
        client: Client,
        data: APIMessageComponentSelectMenuInteraction & {
            data: APIMessageUserSelectInteractionData;
        },
    ) {
        super(client, data);

        this._patch(data);
    }

    public override _patch(
        data: APIMessageComponentSelectMenuInteraction & {
            data: APIMessageUserSelectInteractionData;
        },
    ) {
        super._patch(data);

        this.values = new Collection();

        for (const user of Object.entries(data.data.resolved.users)) {
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
