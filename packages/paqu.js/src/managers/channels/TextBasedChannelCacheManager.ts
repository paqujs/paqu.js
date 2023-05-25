import {
    type Client,
    type TextBasedNonThreadChannelResolvable,
    ChannelMessageManager,
    ChannelPinManager,
} from '../../index';

import { BaseManager } from '../base/BaseManager';

export class TextBasedChannelCacheManager extends BaseManager {
    public channel: TextBasedNonThreadChannelResolvable;
    public messages: ChannelMessageManager;
    public pins: ChannelPinManager;

    public constructor(client: Client, channel: TextBasedNonThreadChannelResolvable) {
        super(client);

        this.channel = channel;

        this.messages = new ChannelMessageManager(client, channel);
        this.pins = new ChannelPinManager(client, channel);
    }
}
