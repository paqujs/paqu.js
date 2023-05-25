import {
    type GatewayThreadListSyncDispatch,
    type APIThreadChannel,
    type ThreadableChannelResolvable,
    type Snowflake,
    AnnouncementChannel,
    TextChannel,
    ThreadChannel,
    ThreadMember,
} from '../../../index';
import { Collection } from '@paqujs/shared';
import { BaseAction } from './BaseAction';

export class THREAD_LIST_SYNC extends BaseAction {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayThreadListSyncDispatch) {
        const guild = this.handler.client.caches.guilds.cache.get(d.guild_id);

        if (guild) {
            if (d.channel_ids) {
                for (const id of d.channel_ids) {
                    const channel = guild.caches.channels.cache.get(
                        id
                    ) as ThreadableChannelResolvable;

                    if (channel) {
                        for (const thread of channel.caches.threads.cache.values()) {
                            this.removeChannelFromEveryting(thread.id, guild);
                        }
                    }
                }
            } else {
                for (const channel of guild.caches.channels.cache.values()) {
                    if (channel instanceof TextChannel || channel instanceof AnnouncementChannel) {
                       
                        for (const thread of channel.caches.threads.cache.values()) {
                            this.removeChannelFromEveryting(thread.id, guild);
                        }
                    }
                }
            }

            const syncedThreads = d.threads.reduce((accumulator, thread) => {
                return accumulator.set(
                    thread.id,
                    new ThreadChannel(this.handler.client, guild, thread as APIThreadChannel)
                );
            }, new Collection<Snowflake, ThreadChannel>());

            for (const thread of syncedThreads.values()) {
                for (const member of d.members) {
                    if (member.id === thread.id) {
                        thread.caches.members.cache.set(
                            member.user_id!,
                            new ThreadMember(this.handler.client, member)
                        );
                    }
                }

                this.addChannelToEveryting(thread, guild);
            }

            this.handler.emit('threadListSync', syncedThreads, guild);
        }
    }
}
