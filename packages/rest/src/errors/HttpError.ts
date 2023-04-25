import { STATUS_CODES } from 'node:http';
import type { FileData, RequestMethods } from '../index';

export type RequestBody = { files: FileData[] | undefined; body: unknown | undefined };

export class HttpError extends Error {
    public status: number;
    public method: RequestMethods;
    public url: string;
    public body: RequestBody;

    public constructor(status: number, method: RequestMethods, url: string, body: RequestBody) {
        super(STATUS_CODES[status]);

        this.status = status;
        this.method = method;
        this.url = url;
        this.body = { files: body.files, body: body.body };
    }
}
