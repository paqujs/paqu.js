import {
    fetch,
    FormData,
    type Response,
    type BodyInit,
    type RequestCredentials,
    type RequestMode,
    type ReferrerPolicy,
    type Dispatcher,
    type RequestDuplex,
    type RequestRedirect,
} from 'undici';
import { AsyncQueue } from '@sapphire/async-queue';
import { setTimeout as sleep } from 'node:timers/promises';
import { Blob } from 'node:buffer';
import { Collection } from '@paqujs/shared';
import merge from 'lodash.merge';
import { HttpError, RateLimitError, RequestBody } from '../index';

export interface RESTOptions {
    offset?: number;
    rejectOnRateLimit?: boolean;
    baseURL: string;
    authPrefix?: 'Bot' | 'Bearer';
    retries?: number;
    baseHeaders?: Record<string, string>;
    agent?: string;
    requestTimeout?: number;
    errorFactory?: (
        req: RequestOptions,
        res: Response,
        url: URL,
        requestBody: RequestBody,
        data: unknown,
    ) => Error;
}

export type RequestOptions = {
    method?: RequestMethods;
    headers?: Record<string, string>;
    files?: FileData[];
    query?: Record<string, string> | URLSearchParams;
    body?: Record<string, any> | BodyInit;
    appendBodyToFormData?: boolean;
    reason?: string;
    agent?: string;
    keepalive?: boolean;
    integrity?: string;
    signal?: AbortSignal;
    credentials?: RequestCredentials;
    mode?: RequestMode;
    referrer?: string;
    referrerPolicy?: ReferrerPolicy;
    window?: null;
    dispatcher?: Dispatcher;
    duplex?: RequestDuplex;
    redirect?: RequestRedirect;
};

export interface FileData {
    key?: string;
    name: string;
    data: Buffer | string;
    type?: string;
}

export interface RateLimitData {
    limited: boolean;
    scope?: 'user' | 'shared' | 'global';
    limit?: number;
    remaining?: number;
    reset?: number;
    retry?: number;
    route?: `/${string}`;
}

export type RequestMethods = 'Get' | 'Post' | 'Put' | 'Patch' | 'Delete';

export const parseResponse = async (res: Response) => {
    const contentType = res.headers.get('content-type');

    if (contentType?.includes('application/json')) {
        return res.json();
    } else if (contentType?.includes('text')) {
        return res.text();
    } else if (contentType?.includes('multipart/form-data')) {
        return res.formData();
    }

    return res.arrayBuffer();
};

export class REST {
    #options: RESTOptions;
    #queue = new AsyncQueue();
    #retries = new Collection<`/${string}`, number>();
    #rateLimits = new Collection<`/${string}`, RateLimitData>();
    #globalRateLimit: RateLimitData = { limited: false };
    #token: string | null = null;

    public constructor(options: RESTOptions) {
        this.#options = merge(
            {},
            {
                offset: 250,
                rejectOnRateLimit: false,
                retries: 3,
                baseHeaders: {},
                requestTimeout: 15000,
                errorFactory: (
                    req: RequestOptions,
                    res: Response,
                    url: URL,
                    requestBody: RequestBody,
                ) => new HttpError(res.status, req.method, url.toString(), requestBody),
            },
            options,
        );
    }

    public get options(): Readonly<RESTOptions> {
        return this.#options;
    }

    public get queue(): Readonly<AsyncQueue> {
        return this.#queue;
    }

    public get retries(): Readonly<Collection<`/${string}`, number>> {
        return this.#retries;
    }

    public get rateLimits(): Readonly<Collection<`/${string}`, RateLimitData>> {
        return this.#rateLimits;
    }

    public get globalRateLimit(): Readonly<RateLimitData> {
        return this.#globalRateLimit;
    }

    public get token(): Readonly<string | null> {
        return this.#token;
    }

    public setToken(token: string | null) {
        this.#token = token
            ? this.options.authPrefix
                ? `${this.options.authPrefix} ${token}`
                : token
            : null;
    }

    public async request<T>(route: `/${string}`, options: RequestOptions = {}): Promise<T> {
        await this.queue.wait();

        const {
            method,
            headers,
            files,
            query,
            body,
            appendBodyToFormData,
            reason,
            agent,
            ...rest
        } = merge(
            {},
            {
                method: 'Get',
                appendBodyToFormData: false,
            },
            options,
        );

        const url = new URL(this.options.baseURL);
        url.pathname += route;

        const requestHeaders = merge({}, this.options.baseHeaders, headers);

        if (this.token && !requestHeaders.Authorization) {
            requestHeaders.Authorization = this.token;
        }

        if (reason?.length) {
            requestHeaders['X-Audit-Log-Reason'] = encodeURIComponent(reason);
        }

        if (this.options.agent?.length || agent?.length) {
            requestHeaders['User-Agent'] = this.options.agent || agent;
        }

        if (query) {
            url.search =
                query instanceof URLSearchParams
                    ? query.toString()
                    : new URLSearchParams(query).toString();
        }

        let resolvedBody: BodyInit;

        if (files?.length) {
            const formData = new FormData();

            for (let i = 0; i < files.length; i++) {
                const file = files[i];

                formData.append(
                    file.key ?? `files[${i}]`,
                    new Blob([file.data], { type: file.type }),
                    file.name,
                );
            }

            if (body !== undefined) {
                if (appendBodyToFormData) {
                    for (const [key, value] of Object.entries(body)) {
                        let resolvedValue = value;

                        formData.append(key, resolvedValue);
                    }
                } else if (files.length) {
                    formData.append('payload_json', JSON.stringify(options.body));
                }
            }

            resolvedBody = formData;

            if (Object.hasOwnProperty.call(requestHeaders, 'Content-Type')) {
                delete requestHeaders['Content-Type'];
            }
        } else {
            if (body !== undefined) {
                if (typeof body === 'object') {
                    resolvedBody = JSON.stringify(body);
                    requestHeaders['Content-Type'] = 'application/json';
                } else {
                    resolvedBody = body;
                }
            }
        }

        if (method === 'Get') {
            resolvedBody = undefined;
        }

        if (this.globalRateLimit.limited) {
            await sleep(this.globalRateLimit.retry!);
            this.#globalRateLimit = { limited: false };
        }

        let rateLimit = this.rateLimits.get(route);

        if (rateLimit?.limited) {
            await sleep(rateLimit.retry!);
            this.#rateLimits.delete(route);
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), this.options.requestTimeout);

        try {
            const response = await fetch(url.toString(), {
                method: method.toUpperCase(),
                headers: requestHeaders,
                body: resolvedBody,
                signal: controller.signal,
                ...rest,
            });

            const data = (await parseResponse(response)) as T;
            const status = response.status;

            if (status === 401) {
                this.#token = null;
            }

            if (status >= 200 && status < 300) {
                return data;
            } else if (status === 429) {
                const scope = response.headers.get('x-ratelimit-scope');
                const limit = response.headers.get('x-ratelimit-limit');
                const remaining = response.headers.get('x-ratelimit-remaining');
                const reset = response.headers.get('x-ratelimit-reset-after');
                const hash = response.headers.get('x-ratelimit-bucket');
                const retry = response.headers.get('retry-after');

                if (scope === 'global') {
                    this.#globalRateLimit = {
                        scope: (scope as any) || 'user',
                        limit: limit ? +limit : Infinity,
                        remaining: remaining ? +remaining : 1,
                        reset: reset
                            ? Date.now() + +reset * 1000 + this.options.offset
                            : Date.now(),
                        retry: retry ? +retry * 1000 + this.options.offset : 0,
                        limited: true,
                        route,
                    };
                } else {
                    this.#rateLimits.set(route, {
                        scope: (scope as any) || 'user',
                        limit: limit ? +limit : Infinity,
                        remaining: remaining ? +remaining : 1,
                        reset: reset
                            ? Date.now() + +reset * 1000 + this.options.offset
                            : Date.now(),
                        retry: retry ? +retry * 1000 + this.options.offset : 0,
                        limited: true,
                        route,
                    });
                }

                rateLimit = this.#globalRateLimit.limited
                    ? this.#globalRateLimit
                    : this.rateLimits.get(route)!;

                if (this.#options.rejectOnRateLimit) {
                    throw new RateLimitError(
                        rateLimit.limit?.toString()!,
                        rateLimit.remaining?.toString()!,
                        rateLimit.reset?.toString()!,
                        hash!,
                        rateLimit.retry?.toString()!,
                        rateLimit.scope!,
                        status,
                        options.method,
                        url.toString(),
                    );
                }

                await sleep(rateLimit.retry);
                return this.request(route, options);
            } else if ((status >= 400 && status < 500) || (status >= 500 && status < 600)) {
                throw this.options.errorFactory.call(
                    this,
                    {
                        method,
                        headers: requestHeaders,
                        body: resolvedBody,
                        signal: controller.signal,
                        ...rest,
                    },
                    response,
                    url,
                    { files, body },
                    data,
                );
            } else {
                return data;
            }
        } catch (e) {
            let retries = this.retries.get(route) || 0;

            if (e instanceof Error && e.name === 'AbortError' && retries < this.options.retries) {
                this.#retries.set(route, ++retries);
                return this.request(route, options);
            }

            this.#retries.delete(route);
            throw e;
        } finally {
            clearTimeout(timeout);
            this.queue.shift();
        }
    }

    public get<T>(route: `/${string}`, options?: RequestOptions) {
        return this.request<T>(route, { ...options, method: 'Get' });
    }

    public post<T>(route: `/${string}`, options?: RequestOptions) {
        return this.request<T>(route, { ...options, method: 'Post' });
    }

    public put<T>(route: `/${string}`, options?: RequestOptions) {
        return this.request<T>(route, { ...options, method: 'Put' });
    }

    public patch<T>(route: `/${string}`, options?: RequestOptions) {
        return this.request<T>(route, { ...options, method: 'Patch' });
    }

    public delete<T>(route: `/${string}`, options?: RequestOptions) {
        return this.request<T>(route, { ...options, method: 'Delete' });
    }
}
