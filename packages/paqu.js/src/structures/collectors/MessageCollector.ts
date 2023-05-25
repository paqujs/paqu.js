import {
    type MessageableChannelResolvable,
    type Client,
    type MessageCollectorOptions,
    type Message,
    type MessageCollectorIgnoreOption,
    AnyChannel,
    ThreadChannel,
    BaseCollector,
} from '../../index';

export class MessageCollector extends BaseCollector<Message> {
    public channel: MessageableChannelResolvable;
    public ignore: MessageCollectorIgnoreOption[];

    public constructor(
        client: Client,
        channel: MessageableChannelResolvable,
        options?: MessageCollectorOptions,
    ) {
        super(client, options);
        this.channel = channel;
        this.ignore = 'ignore' in options ? options.ignore : ['bot'];

        if (!this.ignore.includes('messageCreate')) {
            this.client.ws.on('messageCreate', this.onCollect.bind(this));
        }

        if (!this.ignore.includes('messageUpdate')) {
            this.client.ws.on('messageUpdate', this.onCollect.bind(this));
        }

        if (!this.ignore.includes('messageDelete')) {
            this.client.ws.on('messageDelete', this.onDispose.bind(this));
        }

        this.client.ws.incrementMaxListeners();
        this.client.ws.on('channelDelete', this.onChannelDelete.bind(this));
        this.client.ws.on('threadDelete', this.onThreadDelete.bind(this));

        this.once('end', () => {
            this.client.ws.removeListener('messageCreate', this.onCollect.bind(this));
            this.client.ws.removeListener('messageUpdate', this.onCollect.bind(this));
            this.client.ws.removeListener('messageDelete', this.onDispose.bind(this));
            this.client.ws.removeListener('channelDelete', this.onChannelDelete.bind(this));
            this.client.ws.removeListener('threadDelete', this.onThreadDelete.bind(this));
            this.client.ws.decrementMaxListeners();
        });
    }

    private onCollect(message: Message) {
        if (this.ended) {
            return;
        }

        if (message.channelId !== this.channel.id) {
            return;
        }

        if (this.ignore.includes('bot') && message.author.bot) {
            return;
        }

        if (this.ignore.includes('self') && !message.author.bot) {
            return;
        }

        if (this.filter(message)) {
            this.collected.set(message.id, message);
            this.emit('collect', message);
        }

        if (this.collected.size === this.max) {
            this.terminate('limit');
        }
    }

    private onDispose(message: Message) {
        if (this.ended) {
            return;
        }

        this.collected.delete(message.id);
        this.emit('dispose', message);
    }

    private onChannelDelete(channel: AnyChannel) {
        if (this.ended) {
            return;
        }

        if (channel.id === this.channel.id) {
            this.channel = null;
            this.terminate('channelDelete');
        }
    }

    private onThreadDelete(thread: ThreadChannel) {
        if (this.ended) {
            return;
        }

        if (thread.id === this.channel.id) {
            this.channel = null;
            this.terminate('threadDelete');
        }
    }
}
