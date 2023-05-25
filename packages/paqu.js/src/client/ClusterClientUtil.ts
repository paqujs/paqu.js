import { MessagePort, parentPort } from 'worker_threads';
import { type Client } from '../index';

export class ClusterClientUtil {
    public client: Client;
    public mode: 'process' | 'worker';
    public process: MessagePort | NodeJS.Process;

    public constructor(client: Client) {
        this.client = client;
        this.mode = process.env.CLUSTER_MODE as 'process' | 'worker';
        this.process = this.mode === 'worker' ? parentPort : process;

        process.on('message', this.onMessage.bind(this));

        this.appendListeners();
    }

    public send(data: any) {
        return new Promise<void>((resolve, reject) => {
            if (this.process instanceof MessagePort) {
                this.process.postMessage(data);
                resolve();
            } else {
                this.process.send(data, null, {}, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            }
        });
    }

    public broadcastEval<T>(script: (...args: any[]) => any | string, context?: any): Promise<T[]> {
        return new Promise(async (resolve, reject) => {
            const id = Math.random().toString(36).slice(2, 7);

            const listener = ({ op, d }: any) => {
                if (op === 2 && d.id === id) {
                    this.process.removeListener('message', listener);
                    this.incrementMaxListeners();

                    if (d.error) {
                        const error = new Error(d.error.message);

                        error.name = d.error.name;
                        error.stack = d.error.stack;

                        reject(error);
                    } else {
                        resolve(d.results);
                    }
                }
            };

            this.decrementMaxListeners();
            this.process.on('message', listener);

            await this.send({
                op: 1,
                d: {
                    script:
                        typeof script === 'function'
                            ? `(${script})(this, ${JSON.stringify(context)})`
                            : script,
                    id,
                },
            });
        });
    }

    private async onMessage(data: any) {
        const { op, d } = data;

        switch (op) {
            case 1:
                let error: any;
                let result: any;

                try {
                    result = await eval(d.script);
                } catch (e) {
                    error = {
                        name: e.name,
                        message: e.message,
                        stack: e.stack,
                    };
                }

                await this.send({
                    op: 2,
                    d: {
                        id: d.id,
                        error,
                        result,
                    },
                });
                break;
        }
    }

    private appendListeners() {
        this.client.ws.on('ready', () => {
            this!.send({
                op: 0,
                t: 'ALL_READY',
            });
        });

        this.client.ws.on('shardReady', (shard) => {
            this.send({
                op: 0,
                t: 'SHARD_READY',
                d: shard.id,
            });
        });

        this.client.ws.on('shardResumed', (shard, replayed) => {
            this.send({
                op: 0,
                t: 'SHARD_RESUMED',
                d: [shard.id, replayed],
            });
        });

        this.client.ws.on('shardError', (shard, error) => {
            this.send({
                op: 0,
                t: 'SHARD_ERROR',
                d: [shard.id, error.stack || error.message],
            });
        });

        this.client.ws.on('shardClosed', (shard, code, reason) => {
            this.send({
                op: 0,
                t: 'SHARD_CLOSED',
                d: [shard.id, code, reason],
            });
        });

        this.client.ws.on('shardDeath', (shard, code, reason) => {
            this.send({
                op: 0,
                t: 'SHARD_DEATH',
                d: [shard.id, code, reason],
            });
        });

        this.client.ws.on('shardReconnect', (shard) => {
            this.send({
                op: 0,
                t: 'SHARD_RECONNECT',
                d: shard.id,
            });
        });
    }

    public incrementMaxListeners() {
        this.process.setMaxListeners(this.process.getMaxListeners() + 1);
    }

    public decrementMaxListeners() {
        this.process.setMaxListeners(this.process.getMaxListeners() - 1);
    }
}
