import {
    type Client,
    type GuildBasedInvitableChannelResolvable,
    ChannelInviteManager,
    ChannelPermissionOverwriteManager,
} from '../../index';

import { BaseManager } from '../base/BaseManager';

export class GuildChannelCacheManager extends BaseManager {
    public channel: GuildBasedInvitableChannelResolvable;
    public invites: ChannelInviteManager;
    public permissionOverwrites: ChannelPermissionOverwriteManager;

    public constructor(client: Client, channel: GuildBasedInvitableChannelResolvable) {
        super(client);

        this.channel = channel;

        this.invites = new ChannelInviteManager(client, channel);
        this.permissionOverwrites = new ChannelPermissionOverwriteManager(client, channel);
    }
}
