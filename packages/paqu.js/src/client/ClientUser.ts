import {
    type ClientUserEditData,
    type APIUser,
    type APIConnection,
    type Snowflake,
    Connection,
} from '../index';
import { Collection } from '@paqujs/shared';
import { User } from '../structures/User';

export interface ClientUser {
    fetch(): Promise<ClientUser>;
}

export class ClientUser extends User {
    public async edit(data: ClientUserEditData): Promise<ClientUser> {
        return this._patch(
            await this.client.rest.patch<APIUser>(`/users/@me`, {
                body: data,
            }),
        );
    }

    public override async fetch(): Promise<any> {
        return this._patch(await this.client.rest.get<APIUser>(`/users/@me`));
    }

    public async fetchConnections() {
        const connections = await this.client.rest.get<APIConnection[]>(`/users/@me/connections`);

        return connections.reduce((accumulator, connection) => {
            return accumulator.set(connection.id, new Connection(this.client, connection));
        }, new Collection<Snowflake, Connection>());
    }
}
