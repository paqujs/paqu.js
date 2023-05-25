import {
    type Snowflake,
    type GatewayDispatchPayload,
    type AnyChannel,
    type Guild,
    type WebSocketHandler,
    type GatewayChannelUpdateDispatchData,
    type GuildBasedChannelResolvable,
    DMChannel,
    GroupDMChannel,
} from '../../../index';

export abstract class BaseAction {
    public handler!: WebSocketHandler;

    public abstract handle(packet: GatewayDispatchPayload): void;

    public addChannelToEveryting(channel: AnyChannel, guild?: Guild) {
        if (!(channel instanceof DMChannel || channel instanceof GroupDMChannel) && guild) {
            guild.caches.channels.cache.set(channel.id, channel);
        }

        return this.handler.client.caches.channels.cache.setAndReturnValue(channel.id, channel);
    }

    public removeChannelFromEveryting(id: Snowflake, guild?: Guild) {
        if (guild) {
            guild.caches.channels.cache.delete(id);
        }

        this.handler.client.caches.channels.cache.delete(id);
    }

    public updateChannelInEveryting(
        channel: AnyChannel,
        d: GatewayChannelUpdateDispatchData,
        guild?: Guild,
    ) {
        const _channel = channel._patch(d as never);

        if (!(channel instanceof DMChannel || channel instanceof GroupDMChannel) && guild) {
            guild.caches.channels.cache.set(channel.id, _channel as GuildBasedChannelResolvable);
        }

        return this.handler.client.caches.channels.cache.setAndReturnValue(channel.id, _channel);
    }
}
