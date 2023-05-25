import {
    type Client,
    type CollectorOptions,
    type Snowflake,
    type CollectorFilter,
    type CollectorEvents,
} from '../../index';
import { Collection, TypedEmitter } from '@paqujs/shared';

export class BaseCollector<T> extends TypedEmitter<CollectorEvents<T>> {
    public client: Client;
    public ended = false;
    public endReason: string | null = null;
    public collected = new Collection<Snowflake, T>();
    public max: number;
    public filter: CollectorFilter<T>;
    public time: number | null;
    // eslint-disable-next-line no-undef
    public terminateTimer: NodeJS.Timer;

    public constructor(client: Client, options: CollectorOptions<T>) {
        super();

        this.client = client;

        this.max = 'max' in options ? options.max : Infinity;
        this.filter = 'filter' in options ? options.filter : () => true;
        this.time = 'time' in options ? options.time : null;

        if (this.max < 1) {
            this.max = 1;
        }

        if (this.time) {
            this.terminateTimer = setTimeout(() => this.terminate('time'), this.time);
        }
    }

    public terminate(reason?: string) {
        if (!this.ended) {
            this.ended = true;
            this.endReason = reason;
            clearTimeout(this.terminateTimer);

            this.emit('end', this.collected, reason);
        }
    }
}
