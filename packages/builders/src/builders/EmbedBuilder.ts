import {
    type APIEmbed,
    type APIEmbedAuthor,
    type APIEmbedField,
    type APIEmbedFooter,
    type APIEmbedImage,
    type APIEmbedProvider,
    type APIEmbedThumbnail,
    type APIEmbedVideo,
} from 'discord-api-types/v10';
import { ColorResolver, ColorResolvable } from '@paqujs/resolvers';
import { BaseBuilder } from '../index';

export class EmbedBuilder extends BaseBuilder<APIEmbed> {
    public author: APIEmbedAuthor | null;
    public color: number;
    public description: string | null;
    public fields: APIEmbedField[];
    public footer: APIEmbedFooter | null;
    public image: APIEmbedImage | null;
    public provider: APIEmbedProvider | null;
    public thumbnail: APIEmbedThumbnail | null;
    public timestamp: string | null;
    public title: string | null;
    public url: string | null;
    public video: APIEmbedVideo | null;

    public constructor(data?: APIEmbed) {
        super();

        this.author = data?.author ?? null;
        this.color = data?.color ?? 0;
        this.description = data?.description ?? null;
        this.fields = data?.fields ?? [];
        this.footer = data?.footer ?? null;
        this.image = data?.image ?? null;
        this.provider = data?.provider ?? null;
        this.thumbnail = data?.thumbnail ?? null;
        this.timestamp = data?.timestamp ?? null;
        this.title = data?.title ?? null;
        this.url = data?.url ?? null;
        this.video = data?.video ?? null;
    }

    public setAuthor(author: APIEmbedAuthor) {
        return this.set('author', author);
    }

    public setColor(color: ColorResolvable) {
        return this.set('color', ColorResolver(color));
    }

    public setDescription(description: string) {
        return this.set('description', description);
    }

    public setFields(...fields: APIEmbedField[]) {
        return this.set('fields', fields);
    }

    public addFields(...fields: APIEmbedField[]) {
        return this.set('fields', this.fields.concat(fields));
    }

    public removeFields(...fields: APIEmbedField[]) {
        for (const field of fields) {
            const index = this.fields.indexOf(field);

            if (index > -1) {
                this.fields.splice(index, 1);
            }
        }

        return this;
    }

    public setFooter(footer: APIEmbedFooter) {
        return this.set('footer', footer);
    }

    public setImage(image: APIEmbedImage) {
        return this.set('image', image);
    }

    public setProvider(provider: APIEmbedProvider) {
        return this.set('provider', provider);
    }

    public setThumbnail(thumbnail: APIEmbedThumbnail) {
        return this.set('thumbnail', thumbnail);
    }

    public setTimestamp(timestamp: number | string | Date) {
        return this.set(
            'timestamp',
            timestamp instanceof Date
                ? timestamp.toISOString()
                : typeof timestamp === 'number'
                ? new Date(timestamp).toISOString()
                : timestamp,
        );
    }

    public setTitle(title: string) {
        return this.set('title', title);
    }

    public setURL(url: string) {
        return this.set('url', url);
    }

    public setVideo(video: APIEmbedVideo) {
        return this.set('video', video);
    }
}
