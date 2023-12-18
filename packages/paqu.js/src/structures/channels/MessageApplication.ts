import {
    type Client,
    type APIApplication,
    type Snowflake,
    type ImageOptions,
    Team,
} from '../../index';
import { OAuth2Scopes } from 'discord-api-types/v10';
import { PermissionFlagsBitField, ApplicationFlagsBitField } from '@paqujs/bitfields';

import { BaseApplication } from '../base/BaseApplication';

export class MessageApplication extends BaseApplication {
    public botPublic!: boolean;
    public botRequireCodeGrant!: boolean;
    public coverImage!: string | null;
    public customInstallURL!: string | null;
    public flags!: ApplicationFlagsBitField;
    public installParams!: {
        scopes: (keyof typeof OAuth2Scopes)[];
        permissions: PermissionFlagsBitField;
    } | null;
    public ownerId!: Snowflake | null;
    public rpcOrigins!: string[];
    public tags!: string[];
    public team!: Team | null;

    public constructor(client: Client, data: Partial<APIApplication>) {
        super(client, data);

        this._patch(data);
    }

    public override _patch(data: Partial<APIApplication>) {
        this.botPublic = data.bot_public ?? false;
        this.botRequireCodeGrant = data.bot_require_code_grant ?? false;
        this.coverImage = data.cover_image ?? null;
        this.customInstallURL = data.custom_install_url ?? null;
        this.flags = new ApplicationFlagsBitField(data.flags ?? 0);
        this.installParams = data.install_params
            ? {
                  scopes: data.install_params.scopes
                      ? data.install_params.scopes.map(
                            (scope) => OAuth2Scopes[scope] as keyof typeof OAuth2Scopes,
                        )
                      : [],
                  permissions: new PermissionFlagsBitField(+data.install_params.permissions),
              }
            : null;
        this.ownerId = data.owner?.id ?? null;
        this.rpcOrigins = data.rpc_origins ?? [];
        this.tags = data.tags ?? [];
        this.team = data.team ? new Team(this.client, data.team) : null;

        return this;
    }

    public coverImageURL({ dynamic, size, format }: ImageOptions = { dynamic: true, size: 1024 }) {
        return this.coverImage
            ? `https://cdn.discordapp.com/icons/${this.id}/${this.coverImage}.${
                  dynamic && this.coverImage.startsWith('a_') ? 'gif' : format ?? 'png'
              }?size=${size ?? 1024}`
            : null;
    }

    public get owner() {
        return this.client.caches.users.cache.get(this.ownerId!);
    }
}
