import type { Snowflake, Client, GroupDMChannel, GroupDMAddRecipientData, User } from '../../index';

import { CachedManager } from '../base/CachedManager';

export class GroupDMChannelRecipientManager extends CachedManager<Snowflake, User> {
    public channel: GroupDMChannel;

    public constructor(client: Client, channel: GroupDMChannel) {
        super(client);

        this.channel = channel;
    }

    public async add(userId: Snowflake, data: GroupDMAddRecipientData) {
        await this.client.rest.put(`/channels/${this.channel.id}/recipients/${userId}`, {
            body: data,
        });

        return await this.client.caches.users
            .fetch(userId)
            .then((user: User) => {
                this.cache.set(user.id, user);

                return user as User;
            })
            .catch(() => {
                return userId;
            });
    }

    public remove(userId: Snowflake) {
        this.cache.delete(userId);
        return this.client.rest.delete<void>(`/channels/${this.channel.id}/recipients/${userId}`);
    }
}
