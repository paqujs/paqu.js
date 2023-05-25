import {
    type GatewayThreadMembersUpdateDispatch,
    type Snowflake,
    ThreadChannel,
    ThreadMember,
} from '../../../index';
import { Collection } from '@paqujs/shared';
import { BaseAction } from './BaseAction';

export class THREAD_MEMBERS_UPDATE extends BaseAction {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayThreadMembersUpdateDispatch) {
        const guild = this.handler.client.caches.guilds.cache.get(d.guild_id)!;

        if (guild) {
            const thread = guild.caches.channels.cache.get(d.id) as ThreadChannel;

            if (thread) {
                const addedMembers = new Collection<Snowflake, ThreadMember>();
                const removedMembers = new Collection<Snowflake, ThreadMember>();

                if (d.added_members) {
                    for (const member of d.added_members) {
                        addedMembers.set(
                            member.id!,
                            thread.caches.members.cache.setAndReturnValue(
                                member.id!,
                                new ThreadMember(this.handler.client, member),
                            ),
                        );
                    }
                }

                if (d.removed_member_ids) {
                    for (const id of d.removed_member_ids) {
                        const member = thread.caches.members.cache.get(id);
                        if (member) {
                            removedMembers.set(id, member);
                        }

                        thread.caches.members.cache.delete(id);
                    }
                }

                thread.memberCount = d.member_count;

                this.handler.emit('threadMembersUpdate', thread, addedMembers, removedMembers);
            }
        }
    }
}
