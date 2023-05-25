import type {
    Client,
    APIApplicationRoleConnection,
    ApplicationRoleConnectionMetadata,
    LocalizationMap,
} from '../index';
import { ApplicationRoleConnectionMetadataType } from 'discord-api-types/v10';
import { BaseStructure } from './base/BaseStructure';

export class ApplicationRoleConnection extends BaseStructure {
    public platformName: string | null;
    public platformUsername: string | null;
    public metadata: ApplicationRoleConnectionMetadata;

    public constructor(client: Client, data: APIApplicationRoleConnection) {
        super(client);

        this._patch(data);
    }

    public override _patch(data: APIApplicationRoleConnection) {
        this.platformName = data.platform_name;
        this.platformUsername = data.platform_username;
        this.metadata = {
            description: data.metadata.description as string,
            descriptionLocalizations: data.metadata.description_localizations as LocalizationMap,
            key: data.metadata.key as string,
            name: data.metadata.name as string,
            nameLocalizations: data.metadata.name_localizations as LocalizationMap,
            type: ApplicationRoleConnectionMetadataType[
                data.metadata.type
            ] as keyof typeof ApplicationRoleConnectionMetadataType,
        };

        return this;
    }
}
