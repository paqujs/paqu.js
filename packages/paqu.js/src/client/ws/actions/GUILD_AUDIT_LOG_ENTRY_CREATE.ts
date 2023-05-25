import { type GatewayGuildAuditLogEntryCreateDispatch, AuditLogEntry } from '../../../index';
import { BaseAction } from './BaseAction';

export class GUILD_AUDIT_LOG_ENTRY_CREATE extends BaseAction {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayGuildAuditLogEntryCreateDispatch) {
        const guild = this.handler.client.caches.guilds.cache.get(d.guild_id);

        if (guild) {
            this.handler.emit(
                'guildAuditLogEntryCreate',
                new AuditLogEntry(this.handler.client, guild, d),
            );
        }
    }
}
