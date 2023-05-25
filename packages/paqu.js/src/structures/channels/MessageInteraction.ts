import {
    type APIMessageInteraction,
    type Client,
    type Snowflake,
    SnowflakeUtil,
    User,
} from '../../index';
import { InteractionType } from 'discord-api-types/v10';
import { BaseStructure } from '../base/BaseStructure';

export class MessageInteraction extends BaseStructure {
    public id!: Snowflake;
    public type!: keyof typeof InteractionType;
    public name!: string;
    public user!: User;

    public constructor(client: Client, data: APIMessageInteraction) {
        super(client);

        this._patch(data);
    }

    public _patch(data: APIMessageInteraction) {
        this.id = data.id;
        this.type = InteractionType[data.type] as keyof typeof InteractionType;
        this.name = data.name;
        this.user = this.client.caches.users.cache.setAndReturnValue(
            data.user.id,
            new User(this.client, data.user),
        );

        return this;
    }

    public createdTimestamp() {
        return SnowflakeUtil.timestampFrom(this.id);
    }

    public createdAt() {
        return new Date(this.createdTimestamp());
    }
}
