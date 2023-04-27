import { type APIChannelSelectComponent, ChannelType, ComponentType } from 'discord-api-types/v10';
import { BaseSelectMenuBuilder } from './BaseSelectMenuBuilder';

export type ChannelTypeResolvable = keyof typeof ChannelType | ChannelType;

export class ChannelSelectMenuBuilder extends BaseSelectMenuBuilder<APIChannelSelectComponent> {
    public channel_types: ChannelType[];

    public constructor(data?: Omit<APIChannelSelectComponent, 'type'>) {
        super({ ...data, type: ComponentType.ChannelSelect });

        this.channel_types = data?.channel_types ?? [];
    }

    public setChannelTypes(channelTypes: ChannelTypeResolvable[]) {
        return this.set(
            'channel_types',
            channelTypes.map((channelType) =>
                typeof channelType === 'string' ? ChannelType[channelType] : channelType,
            ),
        );
    }

    public static from(data: Omit<APIChannelSelectComponent, 'type'>) {
        return new ChannelSelectMenuBuilder(data);
    }
}
