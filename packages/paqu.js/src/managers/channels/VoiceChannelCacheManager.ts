import {
    type Client,
    type VoiceChannel,
    ChannelMessageManager,
    ChannelWebhookManager,
} from '../../index';

import { GuildChannelCacheManager } from './GuildChannelCacheManager';

export class VoiceChannelCacheManager extends GuildChannelCacheManager {
    public declare channel: VoiceChannel;
    public messages: ChannelMessageManager;
    public webhooks: ChannelWebhookManager;

    public constructor(client: Client, channel: VoiceChannel) {
        super(client, channel);

        this.channel = channel;

        this.messages = new ChannelMessageManager(client, channel);
        this.webhooks = new ChannelWebhookManager(client, channel);
    }
}
