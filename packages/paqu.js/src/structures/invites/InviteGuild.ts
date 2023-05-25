import { type APIInviteGuild, type Client, type ImageOptions, BaseGuild } from '../../index';
import { GuildNSFWLevel, GuildVerificationLevel } from 'discord-api-types/v10';

export class InviteGuild extends BaseGuild {
    public banner!: string | null;
    public description!: string | null;
    public nsfwLevel!: keyof typeof GuildNSFWLevel;
    public premiumSubscriptionCount!: number | null;
    public splash!: string | null;
    public vanityURLCode!: string | null;
    public verificationLevel!: keyof typeof GuildVerificationLevel;

    public constructor(client: Client, data: APIInviteGuild) {
        super(client, data);

        this._patch(data);
    }

    public override _patch(data: APIInviteGuild) {
        super._patch(data);

        this.banner = data.banner;
        this.description = data.description;
        this.nsfwLevel = GuildNSFWLevel[data.nsfw_level] as keyof typeof GuildNSFWLevel;
        this.premiumSubscriptionCount = data.premium_subscription_count ?? null;
        this.splash = data.splash;
        this.vanityURLCode = data.vanity_url_code;
        this.verificationLevel = GuildVerificationLevel[
            data.verification_level
        ] as keyof typeof GuildVerificationLevel;

        return this;
    }

    public bannerURL({ dynamic, size, format }: ImageOptions = { dynamic: true, size: 1024 }) {
        return this.banner
            ? `https://cdn.discordapp.com/banners/${this.id}/${this.banner}.${
                  dynamic && this.banner.startsWith('a_') ? 'gif' : format ?? 'png'
              }?size=${size ?? 1024}`
            : null;
    }

    public splashURL({ dynamic, size, format }: ImageOptions = { dynamic: true, size: 1024 }) {
        return this.banner
            ? `https://cdn.discordapp.com/splashes/${this.id}/${this.banner}.${
                  dynamic && this.banner.startsWith('a_') ? 'gif' : format ?? 'png'
              }?size=${size ?? 1024}`
            : null;
    }
}
