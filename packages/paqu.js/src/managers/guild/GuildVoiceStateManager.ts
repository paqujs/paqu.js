import type {
    Snowflake,
    VoiceState,
    Client,
    Guild,
    RESTPatchAPIGuildVoiceStateUserJSONBody,
    EditGuildMeVoiceStateData,
} from '../../index';

import { CachedManager } from '../base/CachedManager';

export class GuildVoiceStateManager extends CachedManager<Snowflake, VoiceState> {
    public guild!: Guild;

    public constructor(client: Client, guild: Guild) {
        super(client);

        this.guild = guild;
    }

    public async editUser(userId: Snowflake, data: RESTPatchAPIGuildVoiceStateUserJSONBody) {
        return this.client.caches.guilds.editVoiceStateUser(this.guild.id, userId, data);
    }

    public async editMe(data: EditGuildMeVoiceStateData) {
        return this.client.caches.guilds.editMeVoiceState(this.guild.id, data);
    }
}
