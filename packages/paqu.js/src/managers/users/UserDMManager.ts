import type { Client, CreateMessageData, User } from '../../index';
import { BaseManager } from '../base/BaseManager';

export class UserDMManager extends BaseManager {
    public user: User;

    public constructor(client: Client, user: User) {
        super(client);

        this.user = user;
    }

    public fetch() {
        return this.client.caches.users.fetchDM(this.user.id);
    }

    public create() {
        return this.client.caches.users.createDM(this.user.id);
    }

    public delete() {
        return this.client.caches.users.deleteDM(this.user.id);
    }

    public async send(data: CreateMessageData) {
        return await (await this.create()).send(data);
    }

    public async lastMessage() {
        return (await this.create()).lastMessage;
    }
}
