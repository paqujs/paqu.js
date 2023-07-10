import { setTimeout as sleep } from 'node:timers/promises';
import { isAbsolute, resolve } from 'node:path';
import { TypedEmitter, Collection } from '@paqujs/shared';
import { fetch } from 'undici';
import { APIGatewayBotInfo } from 'discord-api-types/v10';
import { Cluster } from '../index';

export interface ClusterManagerEvents {
    allReady: [clusters: Map<number, Cluster>];
    clusterCreate: [cluster: Cluster];
    clusterReady: [cluster: Cluster];
    clusterRespawn: [cluster: Cluster];
    // eslint-disable-next-line no-undef
    clusterExit: [cluster: Cluster, code: number, signal: NodeJS.Signals];
    // eslint-disable-next-line no-undef
    clusterDeath: [cluster: Cluster, code: number, signal: NodeJS.Signals];
    clusterShardReady: [cluster: Cluster, shardId: number];
    clusterShardReconnect: [cluster: Cluster, shardId: number];
    clusterShardClosed: [cluster: Cluster, shardId: number, code: number, reason: string];
    clusterShardDeath: [cluster: Cluster, shardId: number, code: number, reason: string];
    clusterShardError: [cluster: Cluster, shardId: number, error: string];
    clusterShardResumed: [cluster: Cluster, shardId: number, replayed: number];
}

export interface ClusterManagerOptions {
    shardPerCluster?: number | 'auto';
    clusterCount?: number | 'auto';
    mode?: 'process' | 'worker';
    token?: string;
    autoRespawn?: boolean;
    args?: string[];
    execArgv?: string[];
    file: string;
}

export interface BroadcastEvalOptions {
    context?: any;
    clusterId?: number;
}

export class ClusterManager extends TypedEmitter<ClusterManagerEvents> {
    public shardPerCluster: number;
    public clusterCount: number | 'auto';
    public mode: 'process' | 'worker';
    public token: string;
    public file: string;
    public autoRespawn: boolean;
    public args: string[];
    public execArgv: string[];
    public clusters: Collection<number, Cluster>;
    public spawned = false;

    public constructor({
        shardPerCluster,
        clusterCount,
        mode,
        token,
        file,
        args,
        execArgv,
        autoRespawn,
    }: ClusterManagerOptions) {
        super();

        this.shardPerCluster = shardPerCluster === 'auto' ? 1 : shardPerCluster ?? 1;
        this.clusterCount = clusterCount ?? 'auto';
        this.mode = mode ?? 'process';
        this.file = file;
        this.args = args ?? [];
        this.execArgv = execArgv ?? [];
        this.autoRespawn = autoRespawn ?? true;
        this.token = token ?? process.env.DISCORD_TOKEN;

        if (!isAbsolute(this.file)) {
            this.file = resolve(process.cwd(), this.file);
        }

        this.clusters = new Collection();

        process.env.DISCORD_TOKEN = this.token;
    }

    public createCluster(id: number) {
        const cluster = new Cluster(id, this);

        this.clusters.set(id, cluster);
        this.emit('clusterCreate', cluster);

        return cluster;
    }

    public async getGatewayBot() {
        const response = await fetch('https://discord.com/api/v10/gateway/bot', {
            headers: {
                Authorization: `Bot ${this.token}`,
            },
        });

        if (response.status === 401) {
            throw response;
        }

        return response.json() as Promise<APIGatewayBotInfo>;
    }

    public async spawn(delay = 5000) {
        if (this.spawned) {
            throw new Error('Clusters are already spawned');
        }

        this.spawned = true;

        const gatewayBot = await this.getGatewayBot();

        if (this.clusterCount === 'auto') {
            this.clusterCount = Math.ceil(gatewayBot.shards / this.shardPerCluster);
        }

        const clusters = Array.from({ length: this.clusterCount }, (_, i) => i);

        for (const clusterId of clusters) {
            const promises = [];

            const cluster = this.createCluster(clusterId);

            promises.push(cluster.spawn());

            if (clusters.indexOf(clusterId) !== clusters.length - 1) {
                promises.push(sleep(delay));
            }

            cluster.on('ready', () => {
                this.emit('clusterReady', cluster);

                if (this.clusters.size === this.clusterCount) {
                    this.emit('allReady', this.clusters);
                }
            });

            cluster.on('respawn', () => {
                this.emit('clusterRespawn', cluster);
            });

            cluster.on('exit', (...d) => {
                this.emit('clusterExit', cluster, ...d);
            });

            cluster.on('death', (...d) => {
                this.emit('clusterDeath', cluster, ...d);
            });

            cluster.on('shardReady', (...d) => {
                this.emit('clusterShardReady', cluster, ...d);
            });

            cluster.on('shardReconnect', (...d) => {
                this.emit('clusterShardReconnect', cluster, ...d);
            });

            cluster.on('shardClosed', (...d) => {
                this.emit('clusterShardClosed', cluster, ...d);
            });

            cluster.on('shardDeath', (...d) => {
                this.emit('clusterShardDeath', cluster, ...d);
            });

            cluster.on('shardError', (...d) => {
                this.emit('clusterShardError', cluster, ...d);
            });

            cluster.on('shardResumed', (...d) => {
                this.emit('clusterShardResumed', cluster, ...d);
            });

            await Promise.all(promises);
        }

        return this.clusters;
    }

    public kill() {
        if (!this.spawned) {
            throw new Error('Clusters are not spawned');
        }

        for (const cluster of this.clusters.values()) {
            cluster.kill();
        }

        this.emit('kill');
    }

    public respawn(id?: number) {
        if (!this.spawned) {
            throw new Error('Clusters are not spawned');
        }

        if (id) {
            const cluster = this.clusters.get(id);

            if (!cluster) {
                throw new Error('Cluster not found');
            }

            cluster.respawn();
        } else {
            for (const cluster of this.clusters.values()) {
                cluster.respawn();
            }
        }
    }

    public broadcast(message: string, clusterId?: number) {
        if (!this.spawned) {
            throw new Error('Clusters are not spawned');
        }

        if (clusterId) {
            const cluster = this.clusters.get(clusterId);

            if (!cluster) {
                throw new Error('Cluster not found');
            }

            cluster.send(message);
        } else {
            for (const cluster of this.clusters.values()) {
                cluster.send(message);
            }
        }
    }

    public broadcastEval<T>(
        script: (...args: any[]) => any | string,
        { context, clusterId }: BroadcastEvalOptions = {},
    ): Promise<T | T[]> {
        if (!this.spawned) {
            throw new Error('Clusters are not spawned');
        }

        return new Promise(async (resolve, reject) => {
            let _error: any;
            let _results: any;

            if (clusterId) {
                const cluster = this.clusters.get(clusterId);

                if (!cluster) {
                    throw new Error('Cluster not found');
                }

                const result = await cluster.eval<T>(script, context).catch((e) => {
                    _error = {
                        name: e.name,
                        message: e.message,
                        stack: e.stack,
                    };
                });

                _results = result;
            } else {
                const promises = [];

                for (const cluster of this.clusters.values()) {
                    promises.push(
                        new Promise<void>((resolve) => {
                            cluster
                                .eval(script, context)
                                .then(resolve)
                                .catch((e) => {
                                    _error = {
                                        name: e.name,
                                        message: e.message,
                                        stack: e.stack,
                                    };

                                    resolve();
                                });
                        }),
                    );
                }

                _results = await Promise.all(promises);
            }

            if (_error) {
                const error = new Error(_error.message);

                error.name = _error.name;
                error.stack = _error.stack;

                reject(error);
            } else {
                resolve(_results);
            }
        });
    }
}
