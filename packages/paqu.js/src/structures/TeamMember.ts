import type { APITeamMember, Client, Snowflake } from '../index';
import { TeamMemberMembershipState } from 'discord-api-types/v10';
import { BaseStructure } from './base/BaseStructure';

export class TeamMember extends BaseStructure {
    public membershipState!: keyof typeof TeamMemberMembershipState;
    public permissions!: string[];
    public teamId!: Snowflake;
    public userId!: Snowflake;

    public constructor(client: Client, data: APITeamMember) {
        super(client);

        this._patch(data);
    }

    public override _patch(data: APITeamMember) {
        this.membershipState = TeamMemberMembershipState[
            data.membership_state
        ] as keyof typeof TeamMemberMembershipState;
        this.permissions = data.permissions;
        this.teamId = data.team_id;
        this.userId = data.user.id;

        return this;
    }

    public get user() {
        return this.client.caches.users.cache.get(this.userId);
    }

    public toString() {
        return this.user!.toString();
    }
}
