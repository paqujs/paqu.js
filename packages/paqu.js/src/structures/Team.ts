import {
    type APITeam,
    type Client,
    type Snowflake,
    type ImageOptions,
    TeamMember,
} from '../index';
import { Collection } from '@paqujs/shared';
import { BaseStructure } from './base/BaseStructure';

export class Team extends BaseStructure {
    public icon!: string | null;
    public id!: Snowflake;
    public members!: Collection<Snowflake, TeamMember>;
    public name!: string;
    public ownerId!: Snowflake;

    public constructor(client: Client, data: APITeam) {
        super(client);

        this._patch(data);
    }

    public override _patch(data: APITeam) {
        this.icon = data.icon;
        this.id = data.id;
        this.name = data.name;
        this.ownerId = data.owner_user_id;

        for (const member of data.members) {
            this.members.set(member.user.id, new TeamMember(this.client, member));
        }

        return this;
    }

    public get owner() {
        return this.client.caches.users.cache.get(this.ownerId);
    }

    public iconURL({ dynamic, size, format }: ImageOptions = { dynamic: true, size: 1024 }) {
        return this.icon
            ? `https://cdn.discordapp.com/team-icons/${this.id}/${this.icon}.${
                  dynamic && this.icon.startsWith('a_') ? 'gif' : format ?? 'png'
              }?size=${size ?? 1024}`
            : null;
    }

    public toString() {
        return this.name;
    }
}
