import {
    type Client,
    type APIApplicationRoleConnection,
    type EditApplicationRoleConnectionData,
    type Snowflake,
    type APIApplication,
    ApplicationRoleConnection,
} from '../index';
import { BaseStructure } from '../structures/base/BaseStructure';
import { ApplicationRoleConnectionMetadataType, ApplicationFlags } from 'discord-api-types/v10';

export class ClientApplication extends BaseStructure {
    public id: Snowflake;
    public flags: keyof typeof ApplicationFlags;

    public constructor(client: Client, data: Pick<APIApplication, 'id' | 'flags'>) {
        super(client);

        this._patch(data);
    }

    public override _patch(data: Pick<APIApplication, 'id' | 'flags'>) {
        this.id = data.id;
        this.flags = ApplicationFlags[data.flags] as keyof typeof ApplicationFlags;

        return this;
    }

    public async fetchApplicationRoleConnection() {
        const applicationRoleConnection = await this.client.rest.get<APIApplicationRoleConnection>(
            `/users/@me/applications/${this.client.user.id}/role-connections`,
        );

        return new ApplicationRoleConnection(this.client, applicationRoleConnection);
    }

    public async editApplicationRoleConnection(data: EditApplicationRoleConnectionData) {
        if ('metadata' in data) {
            if ('type' in data.metadata && typeof data.metadata.type !== 'number') {
                data.metadata.type = ApplicationRoleConnectionMetadataType[data.metadata.type];
            }
        }

        const applicationRoleConnection = await this.client.rest.put<APIApplicationRoleConnection>(
            `/users/@me/applications/${this.client.user.id}/role-connections`,
            {
                body: data,
            },
        );

        return new ApplicationRoleConnection(this.client, applicationRoleConnection);
    }
}
