import {
    type Client,
    type ThreadChannel,
    ChannelMessageManager,
    ThreadChannelMemberManager,
} from '../../index';

import { BaseManager } from '../base/BaseManager';

export class ThreadChannelCacheManager extends BaseManager {
    public channel: ThreadChannel;
    public messages: ChannelMessageManager;
    public members: ThreadChannelMemberManager;

    public constructor(client: Client, channel: ThreadChannel) {
        super(client);

        this.channel = channel;

        this.messages = new ChannelMessageManager(client, channel);
        this.members = new ThreadChannelMemberManager(client, channel);
    }
}
