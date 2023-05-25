import type { GatewayVoiceServerUpdateDispatch } from '../../../index';
import { BaseAction } from './BaseAction';

export class VOICE_SERVER_UPDATE extends BaseAction {
    public constructor() {
        super();
    }

    public override handle(payload: GatewayVoiceServerUpdateDispatch) {
        const d = payload.d;
        const guild = this.handler.client.caches.guilds.cache.get(d.guild_id!);

        if (guild) {
            guild.voiceServer = {
                endpoint: d.endpoint,
                token: d.token,
            };
        }

        this.handler.emit('voiceServerUpdate', guild, d.endpoint, d.token);
        this.handler.client.voice.adapters.get(d.guild_id!)?.onVoiceServerUpdate(payload);
    }
}
