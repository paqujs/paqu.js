import {
    type GatewayThreadMemberUpdateDispatch,
    type ThreadChannel,
    ThreadMember,
} from '../../../index';
import { BaseAction } from './BaseAction';

export class THREAD_MEMBER_UPDATE extends BaseAction {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayThreadMemberUpdateDispatch) {
        const guild = this.handler.client.caches.guilds.cache.get(d.guild_id!);

        if (guild) {
            const thread = guild.caches.channels.cache.get(d.id!) as ThreadChannel;

            if (thread) {
                let _member = thread.caches.members.cache.get(d.user_id!);

                if (_member) {
                    const member = _member;

                    _member = _member._patch(d);

                    thread.caches.members.cache.set(member.userId, member);
                    this.handler.emit('threadMemberUpdate', thread, member, _member);
                } else {
                    thread.caches.members.cache.set(
                        d.user_id!,
                        new ThreadMember(this.handler.client, d)
                    );
                }
            }
        }
    }
}
