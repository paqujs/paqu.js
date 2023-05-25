import type { Client } from '../../index';

export class BaseManager {
    public client: Client;

    public constructor(client: Client) {
        this.client = client;
    }
}
