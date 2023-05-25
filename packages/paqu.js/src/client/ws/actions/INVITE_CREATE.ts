import {
    type GatewayInviteCreateDispatch,
    type GuildBasedInvitableChannelResolvable,
    Invite,
} from '../../../index';
import { BaseAction } from './BaseAction';

export class INVITE_CREATE extends BaseAction {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayInviteCreateDispatch) {
        const guild = this.handler.client.caches.guilds.cache.get(d.guild_id!);

        if (guild) {
            const channel = this.handler.client.caches.channels.cache.get(
                d.channel_id,
            ) as GuildBasedInvitableChannelResolvable;

            if (channel) {
                this.handler.emit(
                    'inviteCreate',
                    channel.caches.invites.cache.setAndReturnValue(
                        d.code,
                        new Invite(this.handler.client, d),
                    ),
                );
            }
        }
    }
}
