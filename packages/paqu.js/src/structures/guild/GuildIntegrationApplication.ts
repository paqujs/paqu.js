import { type Client, type APIGuildIntegrationApplication, User } from '../../index';

import { BaseApplication } from '../base/BaseApplication';

export class GuildIntegrationApplication extends BaseApplication {
    public bot!: User | null;

    public constructor(client: Client, data: APIGuildIntegrationApplication) {
        super(client, data);

        this._patch(data);
    }

    public override _patch(data: APIGuildIntegrationApplication) {
        this.bot = data.bot
            ? this.client.caches.users.cache.setAndReturnValue(
                  data.bot.id,
                  new User(this.client, data.bot),
              )
            : null;

        return this;
    }
}
