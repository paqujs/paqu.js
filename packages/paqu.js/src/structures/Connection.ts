import type { APIConnection, Client } from '../index';
import { ConnectionService, ConnectionVisibility } from 'discord-api-types/v10';
import { BaseStructure } from './base/BaseStructure';

export class Connection extends BaseStructure {
    public friendSync: boolean;
    public id: string;
    public name: string;
    public revoked: boolean;
    public showActivity: boolean;
    public twoWayLink: boolean;
    public type: keyof typeof ConnectionService;
    public verified: boolean;
    public visibility: keyof typeof ConnectionVisibility;

    public constructor(client: Client, data: APIConnection) {
        super(client);

        this._patch(data);
    }

    public override _patch(data: APIConnection) {
        this.friendSync = data.friend_sync;
        this.id = data.id;
        data.integrations;
        this.name = data.name;
        this.revoked = data.revoked;
        this.showActivity = data.show_activity;
        this.twoWayLink = data.two_way_link;
        this.type = ConnectionService[data.type];
        this.verified = data.verified;
        this.visibility = ConnectionVisibility[
            data.visibility
        ] as keyof typeof ConnectionVisibility;

        return this;
    }
}
