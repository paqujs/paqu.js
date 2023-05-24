import type { HTTPMethods } from '../index';

export class RateLimitError extends Error {
    public limit: string;
    public remaining: string;
    public reset: string;
    public hash: string;
    public retry: string;
    public scope: 'global' | 'shared' | 'user';
    public status: number;
    public method: HTTPMethods;
    public url: string;
    public override message: string;

    public constructor(
        limit: string,
        remaining: string,
        reset: string,
        hash: string,
        retry: string,
        scope: 'global' | 'shared' | 'user',
        status: number,
        method: HTTPMethods,
        url: string,
    ) {
        super('You Are Being Rate Limited');

        this.limit = limit;
        this.remaining = remaining;
        this.reset = reset;
        this.hash = hash;
        this.retry = retry;
        this.scope = scope;
        this.status = status;
        this.method = method;
        this.url = url;
        this.message = 'You Are Being Rate Limited';
    }
}
