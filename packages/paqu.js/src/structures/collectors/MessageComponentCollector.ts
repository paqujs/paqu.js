import {
    type Message,
    type Client,
    type MessageComponentCollectorOptions,
    type AnyMessageComponentInteraction,
    AnyChannel,
    ThreadChannel,
    BaseCollector,
    ComponentType,
} from '../../index';

export class MessageComponentCollector extends BaseCollector<AnyMessageComponentInteraction> {
    public message: Message;
    public componentType: (keyof typeof ComponentType)[];

    public constructor(
        client: Client,
        message: Message,
        options?: MessageComponentCollectorOptions,
    ) {
        super(client, options as any);

        this.message = message;
        this.componentType =
            'componentType' in options
                ? Array.isArray(options.componentType)
                    ? options.componentType
                    : [options.componentType]
                : ['ActionRow', 'Button', 'SelectMenu', 'TextInput'];

        this.incrementMaxListeners();
        this.client.ws.on('interactionCreate', this.onCollect.bind(this));
        this.client.ws.on('channelDelete', this.onChannelDelete.bind(this));
        this.client.ws.on('threadDelete', this.onThreadDelete.bind(this));
        this.client.ws.on('messageDelete', this.onMessageDelete.bind(this));

        this.once('end', () => {
            this.client.ws.removeListener('interactionCreate', this.onCollect.bind(this));
            this.client.ws.removeListener('channelDelete', this.onChannelDelete.bind(this));
            this.client.ws.removeListener('threadDelete', this.onThreadDelete.bind(this));
            this.client.ws.removeListener('messageDelete', this.onMessageDelete.bind(this));
            this.decrementMaxListeners();
        });
    }

    private onCollect(interaction: AnyMessageComponentInteraction) {
        if (this.ended) {
            return;
        }

        if (interaction.type !== 'MessageComponent') {
            return;
        }

        if (interaction.message.id !== this.message.id) {
            return;
        }

        if (!this.componentType.includes(interaction.componentType)) {
            return;
        }

        if (this.filter(interaction)) {
            this.collected.set(interaction.id, interaction);
            this.emit('collect', interaction);
        }

        if (this.collected.size === this.max) {
            this.terminate('limit');
        }
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
}
