import type { Client, RESTAPIPartialCurrentUserGuild, APIGuild } from '../../index';
import { PermissionFlagsBitField } from '@paqujs/bitfields';

import { BaseGuild } from '../base/BaseGuild';

export class OAuth2Guild extends BaseGuild {
    public owner!: boolean;
    public permissions!: PermissionFlagsBitField;

    public constructor(client: Client, data: RESTAPIPartialCurrentUserGuild) {
        super(client, data as APIGuild);

        this.permissions = new PermissionFlagsBitField(+data.permissions);
        this.owner = data.owner;
    }

    public override async fetch() {
        return (await super.fetch()) as OAuth2Guild;
    }
}
