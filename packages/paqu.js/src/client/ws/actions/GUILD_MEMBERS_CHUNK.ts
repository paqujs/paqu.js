import {
    type GatewayGuildMembersChunkDispatch,
    type Snowflake,
    GuildMember,
    Presence,
} from '../../../index';
import { Collection } from '@paqujs/shared';
import { BaseAction } from './BaseAction';

export class GUILD_MEMBERS_CHUNK extends BaseAction {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayGuildMembersChunkDispatch) {
        const guild = this.handler.client.caches.guilds.cache.get(d.guild_id);

        if (guild) {
            const members = new Collection<Snowflake, GuildMember>();

            for (const member of d.members) {
                const _member = guild.caches.members.cache.get(member.user.id);

                members.set(
                    member.user?.id!,
                    guild.caches.members.cache.setAndReturnValue(
                        member.user!.id,
                        _member
                            ? _member._patch(member)
                            : new GuildMember(this.handler.client, guild, member),
                    ),
                );
            }

            if (d.presences) {
                for (const presence of d.presences) {
                    this.handler.client.caches.presences.set(
                        presence.user.id,
                        new Presence(this.handler.client, { ...presence, guild_id: guild.id }),
                    );
                }
            }

            this.handler.emit('guildMembersChunk', guild, members, {
                chunkIndex: d.chunk_index,
                chunkCount: d.chunk_count,
                notFound: d.not_found ?? [],
                nonce: d.nonce ?? null,
            });
        }
    }
}
