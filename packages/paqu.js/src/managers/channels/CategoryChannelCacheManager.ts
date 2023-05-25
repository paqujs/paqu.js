import { type Client, type CategoryChannel, ChannelPermissionOverwriteManager } from '../../index';

import { BaseManager } from '../base/BaseManager';

export class CategoryChannelCacheManager extends BaseManager {
    public channel: CategoryChannel;
    public permissionOverwrites: ChannelPermissionOverwriteManager;

    public constructor(client: Client, channel: CategoryChannel) {
        super(client);

        this.channel = channel;

        this.permissionOverwrites = new ChannelPermissionOverwriteManager(client, channel);
    }
}
