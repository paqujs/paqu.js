import { type APIAttachment, type Snowflake, SnowflakeUtil } from '../index';

export class Attachment {
    public contentType!: string | null;
    public description!: string | null;
    public ephemeral!: boolean;
    public filename!: string;
    public height!: number | null;
    public id!: Snowflake;
    public proxyURL!: string;
    public size!: number;
    public url!: string;
    public width!: number | null;

    public constructor(data: APIAttachment) {
        this._patch(data);
    }

    public _patch(data: APIAttachment) {
        this.contentType = data.content_type ?? null;
        this.description = data.description ?? null;
        this.ephemeral = data.ephemeral ?? false;
        this.filename = data.filename;
        this.height = data.height ?? null;
        this.proxyURL = data.proxy_url;
        this.size = data.size;
        this.url = data.url;
        this.width = data.width ?? null;

        return this;
    }

    public get createdTimestamp() {
        return SnowflakeUtil.timestampFrom(this.id);
    }

    public get createdAt() {
        return new Date(this.createdTimestamp);
    }

    public toString() {
        return this.url;
    }
}
