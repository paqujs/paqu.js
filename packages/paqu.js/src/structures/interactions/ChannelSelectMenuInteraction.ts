import {
    type Client,
    type APIMessageComponentSelectMenuInteraction,
    type APIMessageChannelSelectInteractionData,
    type Snowflake,
    InteractionDataResolvedChannel,
} from '../../index';
import { Collection } from '@paqujs/shared';
import { BaseMessageComponentInteraction } from '../base/BaseMessageComponentInteraction';

export class ChannelSelectMenuInteraction extends BaseMessageComponentInteraction {
    public values!: Collection<Snowflake, InteractionDataResolvedChannel>;

    public constructor(
        client: Client,
        data: APIMessageComponentSelectMenuInteraction & {
            data: APIMessageChannelSelectInteractionData;
        },
    ) {
        super(client, data);

        this._patch(data);
    }

    public override _patch(
        data: APIMessageComponentSelectMenuInteraction & {
            data: APIMessageChannelSelectInteractionData;
        },
    ) {
        super._patch(data);

        this.values = new Collection();

        for (const channel of Object.values(data.data.resolved.channels)) {
            this.values.set(
                channel.id,
                new InteractionDataResolvedChannel(this.client, channel, this.guild),
            );
        }

        return this;
    }
}
