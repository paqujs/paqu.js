import { type GatewayVoiceStateUpdateDispatch, VoiceState } from '../../../index';
import { BaseAction } from './BaseAction';

export class VOICE_STATE_UPDATE extends BaseAction {
    public constructor() {
        super();
    }

    public override handle(payload: GatewayVoiceStateUpdateDispatch) {
        const d = payload.d;
        const guild = this.handler.client.caches.guilds.cache.get(d.guild_id!);

        if (d.guild_id && d.session_id && d.user_id === this.handler.client.user?.id) {
            this.handler.client.voice.adapters.get(d.guild_id!)?.onVoiceStateUpdate(payload);
        }

        if (guild) {
            let _voiceState =
                guild.caches.voiceStates.cache.get(d.user_id!) ??
                new VoiceState(this.handler.client, d);

            if (_voiceState) {
                const voiceState = _voiceState;

                _voiceState = _voiceState._patch(d);

                guild.caches.voiceStates.cache.set(voiceState.userId, _voiceState);
                this.handler.emit('voiceStateUpdate', voiceState, _voiceState);
            } else {
                const voiceState = new VoiceState(this.handler.client, d);

                guild.caches.voiceStates.cache.set(voiceState.userId, voiceState);
                this.handler.emit('voiceStateUpdate', null, voiceState);
            }
        }
    }
}
