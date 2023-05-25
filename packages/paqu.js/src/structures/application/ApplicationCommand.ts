import {
    type Client,
    type APIApplicationCommand,
    type Snowflake,
    type LocalizationMap,
    type FetchOptions,
    type EditCommandData,
    SnowflakeUtil,
    ApplicationCommandPermissionsChild,
} from '../../index';
import { BaseStructure } from '../base/BaseStructure';
import { PermissionFlagsBitField } from '@paqujs/bitfields';
import { ApplicationCommandType } from 'discord-api-types/v10';

export class ApplicationCommand extends BaseStructure {
    public applicationId!: Snowflake;
    public defaultMemberPermissions!: PermissionFlagsBitField;
    public description!: string;
    public descriptionLocalizations!: LocalizationMap | null;
    public descriptionLocalized!: string | null;
    public dmPermission!: boolean;
    public guildId!: Snowflake | null;
    public id!: Snowflake;
    public name!: string;
    public nameLocalizations!: LocalizationMap | null;
    public nameLocalized!: string | null;
    public options!: any[] | null;
    public type!: keyof typeof ApplicationCommandType;
    public version!: string;
    public nsfw!: boolean;

    public constructor(client: Client, data: APIApplicationCommand) {
        super(client);

        this._patch(data);
    }

    public override _patch(data: APIApplicationCommand) {
        this.applicationId = data.application_id;
        this.defaultMemberPermissions = new PermissionFlagsBitField(
            data.default_member_permissions ? +data.default_member_permissions : 0,
        );
        this.description = data.description;
        this.descriptionLocalizations = data.description_localizations ?? null;
        this.descriptionLocalized = data.description_localized ?? null;
        this.dmPermission = data.dm_permission ?? false;
        this.guildId = data.guild_id ?? null;
        this.id = data.id;
        this.name = data.name;
        this.nameLocalizations = data.name_localizations ?? null;
        this.nameLocalized = data.name_localized ?? null;
        this.options = data.options ?? null;
        this.type = ApplicationCommandType[data.type] as keyof typeof ApplicationCommandType;
        this.version = data.version;
        this.nsfw = data.nsfw ?? false;

        return this;
    }

    public get guild() {
        return this.client.caches.guilds.cache.get(this.guildId!);
    }

    public get createdTimestamp() {
        return SnowflakeUtil.timestampFrom(this.id);
    }

    public get createdAt() {
        return new Date(this.createdTimestamp);
    }

    public async fetch(options?: FetchOptions) {
        if (this.guild) {
            return (await this.guild.caches.commands.fetch(this.id, options)) as ApplicationCommand;
        } else {
            return (await this.client.caches.commands.fetch(
                this.id,
                options,
            )) as ApplicationCommand;
        }
    }

    public async edit(data: EditCommandData) {
        if (this.guild) {
            return await this.guild.caches.commands.edit(this.id, data);
        } else {
            return await this.client.caches.commands.edit(this.id, data);
        }
    }

    public async delete() {
        if (this.guild) {
            return await this.guild.caches.commands.delete(this.id);
        } else {
            return await this.client.caches.commands.delete(this.id);
        }
    }

    public async fetchPermissions() {
        return await this.guild!.caches.commands.fetchPermissions(this.id);
    }

    public async setPermissions(permissions: ApplicationCommandPermissionsChild[], token?: string) {
        return await this.guild!.caches.commands.setPermissions(this.id, permissions, token);
    }

    public toString() {
        return this.name;
    }
}
