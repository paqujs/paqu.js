import {
    type Snowflake,
    type APIApplicationCommandPermissionsData,
    ApplicationCommandPermissionsChild,
} from '../../index';
import { Collection } from '@paqujs/shared';

export class ApplicationCommandPermissions {
    public applicationId!: Snowflake;
    public guildId!: Snowflake;
    public commandId!: Snowflake;
    public permissions!: Collection<Snowflake, ApplicationCommandPermissionsChild>;

    public constructor(data: APIApplicationCommandPermissionsData) {
        this._patch(data);
    }

    public _patch(data: APIApplicationCommandPermissionsData) {
        this.applicationId = data.application_id;
        this.guildId = data.guild_id;
        this.commandId = data.id;
        this.permissions = new Collection(
            data.permissions.map((permission) => [
                permission.id,
                new ApplicationCommandPermissionsChild(permission),
            ]),
        );

        return this;
    }
}
