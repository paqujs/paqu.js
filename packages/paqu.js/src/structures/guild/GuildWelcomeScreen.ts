import {
    type Client,
    type Snowflake,
    type APIGuildWelcomeScreen,
    GuildWelcomeScreenChannel,
} from '../../index';

import { BaseStructure } from '../base/BaseStructure';

export class GuildWelcomeScreen extends BaseStructure {
    public description!: string | null;
    public welcomeChannels!: GuildWelcomeScreenChannel[];
    public guildId: Snowflake;

    public constructor(client: Client, guildId: Snowflake, data: APIGuildWelcomeScreen) {
        super(client);

        this.guildId = guildId;

        this._patch(data);
    }

    public override _patch(data: APIGuildWelcomeScreen) {
        this.description = data.description;

        this.welcomeChannels = [];

        for (const channel of data.welcome_channels) {
            this.welcomeChannels.push(
                new GuildWelcomeScreenChannel(this.client, this.guildId, channel),
            );
        }

        return this;
    }

    public get guild() {
        return this.client.caches.guilds.cache.get(this.guildId)!;
    }

    public async fetch() {
        return await this.client.caches.guilds.fetchWelcomeScreen(this.guildId);
    }
}
