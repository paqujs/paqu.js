import { fork, ChildProcess } from 'child_process';
import { Worker } from 'worker_threads';
import { TypedEmitter } from '@paqujs/shared';
import { type ClusterManager } from '../index';

export enum ClusterOPCodes {
    Dispatch = 0,
    EvalRequest = 1,
    EvalResponse = 2,
}

export enum ClusterDispatchEvents {
    AllReady = 'ALL_READY',
    ShardReady = 'SHARD_READY',
    ShardResumed = 'SHARD_RESUMED',
    ShardReconnect = 'SHARD_RECONNECT',
    ShardClosed = 'SHARD_CLOSED',
    ShardDeath = 'SHARD_DEATH',
    ShardError = 'SHARD_ERROR',
}

export interface ClusterEvents {
    ready: [];
    respawn: [];
    exit: [code: number, signal: NodeJS.Signals];
    death: [code: number, signal: NodeJS.Signals];
    shardReady: [shardId: number];
    shardReconnect: [shardId: number];
    shardClosed: [shardId: number, code: number, reason: string];
    shardDeath: [shardId: number, code: number, reason: string];
    shardError: [shardId: number, error: string];
    shardResumed: [shardId: number, replayed: number];
}

export class Cluster extends TypedEmitter<ClusterEvents> {
    public id: number;
    public manager: ClusterManager;
    public process: ChildProcess | Worker | null;
    public ready = false;
    #env: Record<string, any>;

    public constructor(id: number, manager: ClusterManager) {
        super();

        this.id = id;
        this.manager = manager;
        this.process = null;
        this.#env = {
            DISCORD_TOKEN: this.manager.token,
            CLUSTER_ID: this.id,
            CLUSTER_COUNT: this.manager.clusterCount,
            CLUSTER_MODE: this.manager.mode,
            SHARD_PER_CLUSTER: this.manager.shardPerCluster,
        };
    }

    public get env() {
        return this.#env;
    }

    public spawn() {
        if (this.process) {
            throw new Error('Cluster is already spawned');
        }

        if (this.manager.mode === 'process') {
            this.process = fork(this.manager.file, this.manager.args, {
                env: this.env,
                execArgv: this.manager.execArgv,
            });
        } else {
            this.process = new Worker(this.manager.file, {
                env: this.env,
            });
        }

        this.process.on('message', this.onMessage.bind(this));
        this.process.on('exit', (code, signal) => {
            this.emit('exit', code, signal);

            if (this.manager.autoRespawn) {
                this.respawn();
            } else {
                this.emit('death', code, signal);
            }
        });

        this.emit('spawn');
    }

    public kill() {
        if (!this.process) {
            throw new Error('Cluster is not spawned');
        }

        if (this.process instanceof ChildProcess) {
            this.process.kill();
        } else {
            this.process.terminate();
        }

        this.emit('kill');
    }

    public send(data: any) {
        if (!this.process) {
            throw new Error('Cluster is not spawned');
        }

        return new Promise<void>((resolve, reject) => {
            if (this.process instanceof ChildProcess) {
                this.process.send(data, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            } else {
                this.process.postMessage(data);
                resolve();
            }
        });
    }

    public respawn() {
        if (!this.process) {
            throw new Error('Cluster is not spawned');
        }

        this.kill();

        this.process = null;
        this.ready = false;

        this.emit('respawn');
        this.spawn();
    }

    public eval<T>(script: (...args: any[]) => any | string, context?: any) {
        const resolved =
            typeof script === 'function' ? `(${script})(this, JSON.stringify(${context}))` : script;

        return new Promise<T>((resolve, reject) => {
            const id = Math.random().toString(36).slice(2, 7);

            const listener = ({ op, d }: any) => {
                if (op === ClusterOPCodes.EvalResponse && d.id === id) {
                    this.process?.removeListener('message', listener);

                    if (d.error) {
                        const error = new Error(d.error.message);

                        error.name = d.error.name;
                        error.stack = d.error.stack;

                        reject(error);
                    } else {
                        resolve(d.result);
                    }
                }
            };

            this.process?.on('message', listener);

            this.send({
                op: ClusterOPCodes.EvalRequest,
                d: {
                    id,
                    script: resolved,
                },
            });
        });
    }

    private async onMessage(message: any) {
        const { op, d, t } = message;

        switch (op) {
            case ClusterOPCodes.Dispatch:
                switch (t) {
                    case ClusterDispatchEvents.AllReady:
                        this.emit('ready');
                        this.ready = true;
                        break;
                    case ClusterDispatchEvents.ShardClosed:
                        this.emit('shardClosed', ...(d as [number, number, string]));
                        break;
                    case ClusterDispatchEvents.ShardDeath:
                        this.emit('shardDeath', ...(d as [number, number, string]));
                        break;
                    case ClusterDispatchEvents.ShardError:
                        this.emit('shardError', ...(d as [number, string]));
                        break;
                    case ClusterDispatchEvents.ShardReady:
                        this.emit('shardReady', d);
                        break;
                    case ClusterDispatchEvents.ShardReconnect:
                        this.emit('shardReconnect', d);
                        break;
                    case ClusterDispatchEvents.ShardResumed:
                        this.emit('shardResumed', ...(d as [number, number]));
                        break;
                }
                break;
            case ClusterOPCodes.EvalRequest:
                let hasError = false;

                const results = await this.manager.broadcastEval(d.script).catch((e) => {
                    hasError = true;

                    return {
                        name: e.name,
                        message: e.message,
                        stack: e.stack,
                    };
                });

                this.send({
                    op: ClusterOPCodes.EvalResponse,
                    d: Object.assign({ id: d.id }, hasError ? { error: results } : { results }),
                });

                break;
        }
    }

    public incrementProcessMaxListeners() {
        if (!this.process) {
            throw new Error('Cluster is not spawned');
        }

        this.process.setMaxListeners(this.process.getMaxListeners() + 1);
    }

    public decrementProcessMaxListeners() {
        if (!this.process) {
            throw new Error('Cluster is not spawned');
        }

        this.process.setMaxListeners(this.process.getMaxListeners() - 1);
    }
}
