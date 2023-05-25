import {
    type Snowflake,
    type Client,
    type APIUser,
    type APIDMChannel,
    type FetchOptions,
    type Collectionable,
    User,
    DMChannel,
} from '../../index';

import { CachedManager } from '../base/CachedManager';

export class ClientUserManager extends CachedManager<Snowflake, User> {
    public constructor(client: Client) {
        super(client);
    }

    public async fetch(
        id?: Snowflake | null,
        { force }: FetchOptions = { force: false },
    ): Promise<Collectionable<Snowflake, User>> {
        if (id) {
            let _user = this.cache.get(id)!;

            if (!force && _user) {
                return _user;
            } else {
                const user = await this.client.rest.get<APIUser>(`/users/${id}`);

                if (_user) {
                    _user = _user._patch(user);
                }

                return this.cache.setAndReturnValue(user.id, _user ?? new User(this.client, user));
            }
        } else {
            const users = await this.client.rest.get<APIUser[]>('/users/@me');

            for (const user of users) {
                let _user = this.cache.get(user.id);

                if (_user) {
                    _user = _user._patch(user);
                }

                this.cache.set(user.id, _user ?? new User(this.client, user));
            }

            return this.cache;
        }
    }

    public async createDM(id: Snowflake) {
        const channel = await this.client.rest.post<APIDMChannel>(`/users/@me/channels`, {
            body: { recipient_id: id },
        });

        const _channel = new DMChannel(this.client, channel);

        return this.client.caches.channels.cache.setAndReturnValue(
            channel.id,
            _channel,
        ) as DMChannel;
    }

    public async fetchDM(id: Snowflake) {
        const channel = await this.client.rest.get<APIDMChannel>(`/channels/${id}`);

        let _channel = this.client.caches.channels.cache.get(id) as DMChannel;

        if (_channel) {
            _channel = _channel._patch(channel);
        }

        return this.client.caches.channels.cache.setAndReturnValue(
            channel.id,
            _channel ?? new DMChannel(this.client, channel),
        ) as DMChannel;
    }

    public async deleteDM(id: Snowflake) {
        await this.client.rest.delete(`/channels/${id}`);
        this.client.caches.channels.cache.delete(id);
        return;
    }
}
