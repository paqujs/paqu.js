import type {
    GatewayInviteDeleteDispatch,
    GuildBasedInvitableChannelResolvable,
} from '../../../index';
import { BaseAction } from './BaseAction';

export class INVITE_DELETE extends BaseAction {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayInviteDeleteDispatch) {
        const guild = this.handler.client.caches.guilds.cache.get(d.guild_id!);

        if (guild) {
            const channel = this.handler.client.caches.channels.cache.get(
                d.channel_id,
            ) as GuildBasedInvitableChannelResolvable;

            if (channel) {
                channel.caches.invites.delete(d.code);
            }

            this.handler.emit(
                'inviteDelete',
                guild,
                channel ? channel.caches.invites.cache.get(d.code) ?? d.code : d.code,
            );
        }
    }
}
