import type { Client, CreateMessageData, User } from '../../index';

import { BaseManager } from '../base/BaseManager';

export class UserDMManager extends BaseManager {
    public user: User;

    public constructor(client: Client, user: User) {
        super(client);

        this.user = user;
    }

    public async fetch() {
        return await this.client.caches.users.fetchDM(this.user.id);
    }

    public async create() {
        return await this.client.caches.users.createDM(this.user.id);
    }

    public async delete() {
        return await this.client.caches.users.deleteDM(this.user.id);
    }

    public async send(data: CreateMessageData) {
        return await (await this.create()).send(data);
    }

    public async lastMessage() {
        return (await this.create()).lastMessage;
    }
}
