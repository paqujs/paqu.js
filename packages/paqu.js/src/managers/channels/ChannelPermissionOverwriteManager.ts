import type {
    Snowflake,
    Client,
    ChannelOverwriteData,
    GuildBasedPermissionOverwritableChannelResolvable,
    CreateChannelOverwriteData,
} from '../../index';
import { OverwriteType } from 'discord-api-types/v10';
import { PermissionFlagsBitField } from '@paqujs/bitfields';
import { PermissionFlagsBitsResolver } from '@paqujs/resolvers';

import { CachedManager } from '../base/CachedManager';

export class ChannelPermissionOverwriteManager extends CachedManager<
    Snowflake,
    ChannelOverwriteData
> {
    public channel: GuildBasedPermissionOverwritableChannelResolvable;

    public constructor(client: Client, channel: GuildBasedPermissionOverwritableChannelResolvable) {
        super(client);

        this.channel = channel;

        for (const permission of this.channel.rawPermissionOverwrites) {
            this.cache.set(permission.id, {
                id: permission.id,
                type: OverwriteType[permission.type] as keyof typeof OverwriteType,
                allow: new PermissionFlagsBitField(
                    permission.allow
                        ? (PermissionFlagsBitsResolver(+permission.allow) as number)
                        : 0,
                ),
                deny: new PermissionFlagsBitField(
                    permission.deny ? (PermissionFlagsBitsResolver(+permission.deny) as number) : 0,
                ),
            });
        }
    }

    public async create(data: CreateChannelOverwriteData, reason?: string) {
        await this.channel.guild.caches.channels.createOverwrite(this.channel.id, data, reason);

        return {
            id: data.id,
            type: OverwriteType[data.type] as keyof typeof OverwriteType,
            allow: new PermissionFlagsBitField(
                data.allow ? (PermissionFlagsBitsResolver(data.allow) as number) : 0,
            ),
            deny: new PermissionFlagsBitField(
                data.deny ? (PermissionFlagsBitsResolver(data.deny) as number) : 0,
            ),
        };
    }

    public async delete(id: Snowflake, reason?: string) {
        return await this.channel.guild.caches.channels.deleteOverwrite(
            this.channel.id,
            id,
            reason,
        );
    }

    public async set(permissions: CreateChannelOverwriteData[]) {
        this.cache.clear();
        return (await this.client.caches.channels.edit(this.channel.id, {
            permission_overwrites: permissions,
        })) as GuildBasedPermissionOverwritableChannelResolvable;
    }
}
