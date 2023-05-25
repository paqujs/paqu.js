import { type Client, GroupDMChannelRecipientManager, GroupDMChannel } from '../../index';

import { TextBasedChannelCacheManager } from './TextBasedChannelCacheManager';

export class GroupDMChannelCacheManager extends TextBasedChannelCacheManager {
    public declare channel: GroupDMChannel;
    public recipients: GroupDMChannelRecipientManager;

    public constructor(client: Client, channel: GroupDMChannel) {
        super(client, channel);

        this.channel = channel;

        this.recipients = new GroupDMChannelRecipientManager(client, channel);
    }
}
