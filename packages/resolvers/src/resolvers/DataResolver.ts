import { readFile } from 'node:fs/promises';
import { parse, resolve } from 'node:path';
import { fetch } from 'undici';
import * as FileType from 'file-type';

export interface FileData {
    name: string;
    data: Buffer | string;
    type?: string;
}

export type ImageMimes = 'image/png' | 'image/jpeg' | 'image/gif';

export class DataResolver {
    public static HttpPattern = /^(https?)?:\/\//;
    public static ImagePattern = /^data:image\/(png|jpeg|gif);base64,(.*)/;
    public static ImageMimesArray = ['image/png', 'image/jpeg', 'image/gif'] as const;

    public static async resolveFile(filePathOrUrlOrBuffer: string | Buffer): Promise<FileData> {
        if (Buffer.isBuffer(filePathOrUrlOrBuffer)) {
            const resolved = await FileType.fileTypeFromBuffer(filePathOrUrlOrBuffer);

            return {
                data: filePathOrUrlOrBuffer,
                type: resolved?.mime ?? 'image/jpeg',
                name: `file.${resolved?.ext}`,
            };
        } else if (DataResolver.HttpPattern.test(filePathOrUrlOrBuffer)) {
            const response = await fetch(filePathOrUrlOrBuffer);
            const buffer = await response.arrayBuffer();

            return {
                data: Buffer.from(buffer),
                type:
                    response.headers.get('content-type') ??
                    (await FileType.fileTypeFromBuffer(buffer))?.mime ??
                    'image/jpeg',
                name: parse(filePathOrUrlOrBuffer).base,
            };
        } else {
            const buffer = await readFile(resolve(filePathOrUrlOrBuffer));
            return {
                data: buffer,
                type: (await FileType.fileTypeFromBuffer(buffer))?.mime ?? 'image/jpeg',
                name: parse(filePathOrUrlOrBuffer).base,
            };
        }
    }

    public static async resolveImage(data: Buffer | string, type?: ImageMimes): Promise<string> {
        if (Buffer.isBuffer(data)) {
            if (!DataResolver.ImageMimesArray.includes(type))
                type = (await FileType.fileTypeFromBuffer(data)).mime as ImageMimes;

            return `data:${type};base64,${data.toString('base64')}`;
        } else if (this.ImagePattern.test(data)) {
            return data;
        } else {
            const resolved = await DataResolver.resolveFile(data);
            if (!DataResolver.ImageMimesArray.includes(resolved.type as ImageMimes))
                type = 'image/jpeg';

            return await DataResolver.resolveImage(
                resolved.data as string,
                resolved.type as ImageMimes,
            );
        }
    }

    public static async resolveBase64(data: Buffer | string): Promise<string> {
        if (Buffer.isBuffer(data)) {
            return data.toString('base64');
        } else {
            const resolved = await DataResolver.resolveFile(data);
            return await DataResolver.resolveBase64(resolved.data as string);
        }
    }
}
