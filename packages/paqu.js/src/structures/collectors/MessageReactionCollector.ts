import {
    type Message,
    type Client,
    type MessageReactionCollectorOptions,
    type MessageReactionCollectorIgnoreOption,
    type MessageReaction,
    AnyChannel,
    ThreadChannel,
    BaseCollector,
} from '../../index';

export class MessageReactionCollector extends BaseCollector<MessageReaction> {
    public message: Message;
    public ignore: MessageReactionCollectorIgnoreOption[];

    public constructor(client: Client, message: Message, options?: MessageReactionCollectorOptions) {
        super(client, options);

        this.message = message;
        this.ignore = 'ignore' in options ? options.ignore : ['bot'];

        if (!this.ignore.includes('reactionAdd')) {
            this.client.ws.on('messageReactionAdd', this.onCollect.bind(this));
        }

        if (!this.ignore.includes('reactionRemove')) {
            this.client.ws.on('messageReactionRemove', this.onDispose.bind(this));
        }

        this.incrementMaxListeners();
        this.client.ws.on('channelDelete', this.onChannelDelete.bind(this));
        this.client.ws.on('threadDelete', this.onThreadDelete.bind(this));
        this.client.ws.on('messageDelete', this.onMessageDelete.bind(this));

        this.once('end', () => {
            this.client.ws.removeListener('messageReactionAdd', this.onCollect.bind(this));
            this.client.ws.removeListener('channelDelete', this.onChannelDelete.bind(this));
            this.client.ws.removeListener('threadDelete', this.onThreadDelete.bind(this));
            this.client.ws.removeListener('messageDelete', this.onMessageDelete.bind(this));
            this.decrementMaxListeners();
        });
    }

    private onCollect(reaction: MessageReaction) {
        if (this.ended) {
            return;
        }

        if (this.ignore.includes('bot') && reaction.user.bot) {
            return;
        }

        if (this.ignore.includes('self') && !reaction.user.bot) {
            return;
        }

        if (this.filter(reaction)) {
            this.collected.set(this.resolveEmojiKey(reaction), reaction);
            this.emit('collect', reaction);
        }

        if (this.collected.size === this.max) {
            this.terminate('limit');
        }
    }

    private onDispose(reaction: MessageReaction) {
        if (this.ended) {
            return;
        }

        this.collected.delete(this.resolveEmojiKey(reaction));
        this.emit('dispose', reaction);
    }

    private onMessageDelete(message: Message) {
        if (this.ended) {
            return;
        }

        if (message.id === this.message.id) {
            this.terminate('messageDelete');
        }
    }

    private onChannelDelete(channel: AnyChannel) {
        if (this.ended) {
            return;
        }

        if (channel.id === this.message.channelId) {
            this.terminate('channelDelete');
        }
    }

    private onThreadDelete(thread: ThreadChannel) {
        if (this.ended) {
            return;
        }

        if (thread.id === this.message.channelId) {
            this.terminate('threadDelete');
        }
    }

    private resolveEmojiKey(reaction: MessageReaction) {
        return reaction.emoji.id ?? reaction.emoji.name;
    }
}
