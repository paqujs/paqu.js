import type { WebSocketOptions } from '@paqujs/ws';
import { REST } from '@paqujs/rest';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defu } from 'defu';
import {
    DiscordAPIError,
    WebSocketHandler,
    ClientCacheManager,
    ClientUser,
    ClientApplication,
    ClientVoiceManager,
    ClusterClientUtil,
} from '../index';

export interface PartialRESTOptions {
    offset?: number;
    rejectOnRateLimit?: boolean;
    authPrefix?: 'Bot' | 'Bearer';
    retries?: number;
    requestTimeout?: number;
    version?: number;
}

export interface ClientOptions {
    ws: Omit<WebSocketOptions, 'rest'>;
    rest?: PartialRESTOptions;
    failIfNotExists?: boolean;
}

export class Client {
    public user: ClientUser | null;
    public application: ClientApplication | null;
    public ws: WebSocketHandler;
    public rest: REST;
    public caches: ClientCacheManager;
    public voice: ClientVoiceManager;
    public cluster: ClusterClientUtil | null;
    #options: ClientOptions;

    public constructor({ ws, rest, failIfNotExists }: ClientOptions) {
        this.#options = defu(
            { ws, rest, failIfNotExists },
            {
                rest: {
                    version: 10,
                    authPrefix: 'Bot' as const,
                },
                failIfNotExists: false,
            },
        );

        this.user = null;
        this.application = null;
        this.cluster = null;

        this.rest = new REST({
            baseURL: `https://discord.com/api/v${this.#options.rest.version}`,
            agent: `paqu.js (https://github.com/paqujs/paqu.js, ${
                JSON.parse(
                    readFileSync(
                        join(dirname(fileURLToPath(import.meta.url)), '..', 'package.json'),
                        'utf-8',
                    ),
                ).version
            })`,
            errorFactory: (req, res, url, requestBody, data: any) =>
                new DiscordAPIError(
                    res.status,
                    data.code,
                    req.method,
                    url.toString(),
                    data.message,
                    requestBody,
                    data.errors ? data.errors.data : [],
                ),
            ...this.#options.rest,
        });

        this.ws = new WebSocketHandler(this, this.#options.ws);
        this.caches = new ClientCacheManager(this);
        this.voice = new ClientVoiceManager(this);

        if (process.env.CLUSTER_ID) {
            this.cluster = new ClusterClientUtil(this);
        }
    }

    public get options(): Readonly<ClientOptions> {
        return this.#options;
    }

    public destroy() {
        this.user = null;

        this.ws.manager.destroy();
        this.rest.setToken(null);
    }
}
