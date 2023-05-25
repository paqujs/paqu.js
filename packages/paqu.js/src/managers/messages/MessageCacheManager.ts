import { type Client, type Message, MessageReactionManager, type APIReaction } from '../../index';

import { BaseManager } from '../base/BaseManager';

export class MessageCacheManager extends BaseManager {
    public message: Message;
    public reactions: MessageReactionManager;

    public constructor(message: Message, reactions: APIReaction[], client: Client) {
        super(client);

        this.message = message;

        this.reactions = new MessageReactionManager(client, message, reactions);
    }
}
