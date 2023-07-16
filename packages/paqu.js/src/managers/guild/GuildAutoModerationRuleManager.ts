import type {
    Snowflake,
    Client,
    Guild,
    AutoModerationRule,
    Collectionable,
    FetchOptions,
    CreateAutoModerationRuleData,
    EditAutoModerationRuleData,
} from '../../index';
import { Collection } from '@paqujs/shared';
import { CachedManager } from '../base/CachedManager';

export class GuildAutoModerationRuleManager extends CachedManager<Snowflake, AutoModerationRule> {
    public guild!: Guild;

    public constructor(client: Client, guild: Guild) {
        super(client);

        this.guild = guild;
    }

    public async delete(id: Snowflake, reason?: string) {
        this.cache.delete(id);
        return await this.client.caches.guilds.deleteAutoModerationRule(this.guild.id, id, reason);
    }

    public async fetch(
        id?: Snowflake,
        { force }: FetchOptions = { force: false },
    ): Promise<Collectionable<Snowflake, AutoModerationRule>> {
        if (id) {
            const _rule = this.cache.get(id);

            if (_rule && !force) {
                return _rule;
            } else {
                const rule = (await this.client.caches.guilds.fetchAutoModerationRules(
                    this.guild.id,
                    id,
                )) as AutoModerationRule;

                return this.cache.set(rule.id!, rule);
            }
        } else {
            const rules = (await this.client.caches.guilds.fetchAutoModerationRules(
                this.guild.id,
            )) as Collection<Snowflake, AutoModerationRule>;

            this.cache.clear();
            this.cache.concat(rules);
        }

        return this.cache;
    }

    public async edit(id: Snowflake, data: EditAutoModerationRuleData, reason?: string) {
        const rule = await this.client.caches.guilds.editAutoModerationRule(
            this.guild.id,
            id,
            data,
            reason,
        );

        return this.cache.setAndReturnValue(rule.id!, rule);
    }

    public async create(data: CreateAutoModerationRuleData, reason?: string) {
        const rule = await this.client.caches.guilds.createAutoModerationRule(
            this.guild.id,
            data,
            reason,
        );

        return this.cache.setAndReturnValue(rule.id!, rule);
    }
}
