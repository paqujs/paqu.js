import { setTimeout as sleep } from 'node:timers/promises';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { TypedEmitter, Collection, BitField } from '@paqujs/shared';
import { GatewayIntentBitsResolver } from '@paqujs/resolvers';
import { REST } from '@paqujs/rest';
import merge from 'lodash.merge';
import {
    type GatewayRequestGuildMembersData,
    type GatewayVoiceStateUpdateData,
    type GatewayDispatchPayload,
    type GatewayReceivePayload,
    type APIGatewayBotInfo,
    type APIUser,
} from 'discord-api-types/v10';
import {
    type PresenceData,
    type GatewayIntentBitsResolvable,
    WebSocketShard,
    DiscordAPIVersion,
    DiscordAPIError,
} from '../index';

const NonReconnectableCloseCodes = new Set([4004, 4010, 4011, 4012, 4013, 4014]);

export interface WebSocketProperties {
    os?: NodeJS.Platform;
}

export interface WebSocketOptions {
    intents: GatewayIntentBitsResolvable;
    largeThreshold?: number;
    presence?: PresenceData;
    shardCount?: number | 'auto';
    compress?: boolean;
    properties?: WebSocketProperties;
    autoReconnect?: boolean;
    rest?: RESTOptions;
    instance?: Function;
}

export interface WebSocketEvents {
    ready: [user: APIUser];
    dispatch: [data: GatewayDispatchPayload];
    receive: [data: GatewayReceivePayload];
    shardSpawn: [shard: WebSocketShard];
    shardReady: [shard: WebSocketShard];
    shardClosed: [shard: WebSocketShard, code: number, reason: string];
    shardDeath: [shard: WebSocketShard, code: number, reason: string];
    shardReconnect: [shard: WebSocketShard];
    shardResumed: [shard: WebSocketShard, replayed: number];
    shardError: [shard: WebSocketShard, error: Error];
    debug: [message: string];
}

export interface RESTOptions {
    offset?: number;
    rejectOnRateLimit?: boolean;
    authPrefix?: 'Bot' | 'Bearer';
    retries?: number;
    requestTimeout?: number;
}

export class WebSocketManager extends TypedEmitter<WebSocketEvents> {
    public uptimeTimestamp: number;
    #token: string | null;
    #shardList: number[] | null;
    #shardQueue: Set<WebSocketShard> | null;
    #shards = new Collection<number, WebSocketShard>();
    #options: WebSocketOptions;
    #instance: Function;

    public constructor({
        intents,
        shardCount,
        largeThreshold,
        presence,
        compress,
        properties,
        autoReconnect,
        rest,
        instance,
    }: WebSocketOptions) {
        super();

        this.#options = merge(
            {},
            {
                shardCount: 'auto',
                largeThreshold: 50,
                compress: true,
                properties: {
                    os: process.platform,
                },
                autoReconnect: true,
                presence: null,
                rest: {
                    authPrefix: 'Bot',
                },
            },
            {
                intents: new BitField().set(GatewayIntentBitsResolver(intents)),
                largeThreshold,
                presence,
                shardCount,
                compress,
                properties,
                autoReconnect,
                rest,
            },
        );

        this.#shardList = null;
        this.#shardQueue = null;

        this.#token = null;
        this.uptimeTimestamp = -1;
        this.#instance = instance ?? this.constructor;

        Object.defineProperty(this.#instance.prototype, 'rest', {
            value: new REST({
                baseURL: `https://discord.com/api/v${DiscordAPIVersion}`,
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
            }),
        });
    }

    public get instance(): Function {
        return this.#instance;
    }

    public get uptime(): number {
        return this.uptimeTimestamp === -1 ? 0 : Date.now() - this.uptimeTimestamp;
    }

    public get shards(): Readonly<Collection<number, WebSocketShard>> {
        return this.#shards;
    }

    public get shardList(): Readonly<number[]> {
        return this.#shardList;
    }

    public get shardQueue(): Readonly<Set<WebSocketShard>> {
        return this.#shardQueue;
    }

    public get token(): Readonly<string> {
        return this.#token;
    }

    public get rest(): Readonly<REST> {
        return this.#instance.prototype.rest;
    }

    public get options(): Readonly<WebSocketOptions> {
        return this.#options;
    }

    public async getGatewayBot() {
        return await this.rest.get<APIGatewayBotInfo>('/gateway/bot');
    }

    public get ping() {
        return Math.ceil(
            this.#shards.reduce((total, shard: any) => total + shard.ping, 0) / this.#shards.size,
        );
    }

    public async connect(token: string = process.env.DISCORD_TOKEN) {
        if (typeof token === 'string') {
            token = token.replace(/^(Bot|Bearer)\s/iu, '');
        }

        this.emit('debug', '[WS]: Connecting to gateway...');

        this.#token = token;
        this.rest.setToken(token);

        if (process.env.CLUSTER_ID) {
            this.#options.shardCount = +process.env.SHARD_PER_CLUSTER;
            this.#shardList = [
                ...Array.from(
                    { length: this.#options.shardCount },
                    (_, i) => i + +process.env.CLUSTER_ID * +process.env.SHARD_PER_CLUSTER,
                ),
            ];
        } else {
            const { shards, session_start_limit } = await this.getGatewayBot();

            if (this.#options.shardCount === 'auto') {
                this.#options.shardCount = shards;
            } else if (this.#options.shardCount < 1) {
                this.#options.shardCount = 1;
            }

            if (this.#options.shardCount > session_start_limit.total) {
                throw new Error(
                    'The shard count is greater than the total number of shards allowed by the discord gateway.',
                );
            }

            this.#shardList = Array.from({ length: this.#options.shardCount }, (_, i) => i);
        }

        this.#shardQueue = new Set<WebSocketShard>(
            this.#shardList?.map((id) => new WebSocketShard(this, id)),
        );

        return await this.spawnShards();
    }

    public broadcast(data: any) {
        for (const shard of this.#shards.values()) {
            shard.send(data);
        }

        return true;
    }

    public async broadcastEval<T>(script: string) {
        const promises: T[] = [];

        for (const shard of this.#shards.values()) {
            promises.push(shard.eval<T>(script));
        }

        return await Promise.all(promises);
    }

    public destroy() {
        this.#shardList = null;
        this.#token = null;
        this.uptimeTimestamp = -1;

        this.#shards.forEach((shard) =>
            shard.close(1000, true, {
                hard: true,
                removeManagerListeners: true,
                removeSocketListeners: true,
                resetReadyTimestamp: true,
            }),
        );

        this.#shards.clear();
        this.#shardQueue?.clear();

        this.emit('debug', '[WS] Destroyed manager');
    }

    public async spawnShards(): Promise<boolean> {
        if (!this.#shardQueue!.size) return false;

        const [shard] = this.#shardQueue!;

        this.emit('debug', `[WS]: Spawning shard ${shard.id}...`);
        this.#shardQueue?.delete(shard);

        if (!shard.eventsAppended) {
            shard.on('ready', (user) => {
                this.emit('debug', `[WS]: Shard ${shard.id} is ready`);
                this.emit('shardReady', shard);

                if (this.checkReady() && this.uptimeTimestamp < 0) {
                    this.uptimeTimestamp = Date.now();
                    this.emit('ready', user);
                }
            });

            shard.on('resumed', (replayed) => {
                this.emit(
                    'debug',
                    `[WS]: Shard ${shard.id} resumed with ${replayed} replayed events`,
                );
                this.emit('shardResumed', shard, replayed);
            });

            shard.on('error', (error) => {
                this.emit(
                    'debug',
                    `[WS]: Shard ${shard.id} encountered an error: ${error.message}`,
                );
                this.emit('shardError', shard, error);
            });

            shard.on('close', (code, reason) => {
                this.emit(
                    'debug',
                    `[WS]: Shard ${shard.id} closed with code ${code} and reason ${reason}`,
                );
                this.emit('shardClosed', shard, code, reason);

                if (!NonReconnectableCloseCodes.has(code) && this.#options.autoReconnect) {
                    this.reconnect(shard.id);
                } else {
                    this.emit('debug', `[WS]: Shard ${shard.id} is dead and will not be respawned`);
                    this.emit('shardDeath', shard, code, reason);
                }
            });

            shard.eventsAppended = true;
        }

        this.#shards.set(shard.id, shard);

        try {
            this.emit('shardSpawn', shard);
            await shard.connect();
        } catch {
            this.#shardQueue?.add(shard);
        }

        if (this.#shardQueue!.size) {
            await this.sleepForShardRateLimit(shard.id);
            return await this.spawnShards();
        }

        return true;
    }

    public async reconnect(id: number) {
        const shard = this.#shards.get(id);

        if (!shard) {
            return false;
        } else {
            shard.status = 'Reconnecting';
            this.emit('debug', `[WS]: Shard ${shard.id} is reconnecting...`);
            this.emit('shardReconnect', shard);

            shard.close(4000, true, {
                hard: true,
                removeManagerListeners: false,
                removeSocketListeners: true,
                resetReadyTimestamp: true,
            });

            await sleep(5000);
            await shard.connect();

            return true;
        }
    }

    public checkReady() {
        if (
            this.#shards.size !== this.#options.shardCount ||
            !this.#shards.every((shard) => shard.checkReady()) ||
            this.#shardQueue!.size
        )
            return false;

        return true;
    }

    public async sleepForShardRateLimit(shardId: number) {
        const { session_start_limit } = await this.getGatewayBot();
        const { max_concurrency } = session_start_limit;

        const rateLimitKey = shardId % max_concurrency;

        if (shardId && !rateLimitKey) {
            return await sleep(5000);
        } else {
            return;
        }
    }

    public async respawn(id: number) {
        if (!this.#shards.get(id)) return false;

        this.emit('debug', `[WS]: Shard ${id} is respawning...`);
        const shard = this.#shards.get(id)!;

        shard.close(1000, true, {
            hard: true,
            removeManagerListeners: true,
            removeSocketListeners: true,
            resetReadyTimestamp: true,
        });

        this.#shards.delete(id);
        this.#shardQueue?.add(shard);

        await sleep(5000);
        return await this.spawnShards();
    }

    public async respawnAll() {
        for await (const shard of this.#shards.values()) {
            await this.respawn(shard.id);
        }

        return;
    }

    public async bulkRequestGuildMembers(data: GatewayRequestGuildMembersData, shardId?: number) {
        if (shardId) {
            const shard = this.#shards.get(shardId);
            if (!shard) return;

            shard.requestGuildMembers(data);
        } else {
            for (const shard of this.#shards.values()) {
                shard.requestGuildMembers(data);
            }
        }

        return;
    }

    public async bulkUpdateVoiceState(data: GatewayVoiceStateUpdateData, shardId?: number) {
        if (shardId) {
            const shard = this.#shards.get(shardId);
            if (!shard) return;

            shard.updateVoiceState(data);
        } else {
            for (const shard of this.#shards.values()) {
                shard.updateVoiceState(data);
            }
        }

        return;
    }

    public async bulkUpdatePresence(data: PresenceData, shardId?: number) {
        if (shardId) {
            const shard = this.#shards.get(shardId);
            if (!shard) return;

            shard.updatePresence(data);
        } else {
            for (const shard of this.#shards.values()) {
                shard.updatePresence(data);
            }
        }

        return;
    }
}
