import { EventEmitter } from 'events';
import type { Awaitable } from '../index';

export type DefaultListener = {
    [event: string]: any[];
};

export type ListenerSignature<L> = {
    [E in keyof L]: L[E] extends [...args: infer A] ? A : never;
};

export declare interface TypedEmitter<L extends ListenerSignature<L> = DefaultListener> {
    addListener<E extends keyof L>(event: E, listener: (...args: L[E]) => Awaitable<void>): this;
    addListener<S extends string | symbol>(
        event: Exclude<S, keyof L>,
        listener: (...args: any[]) => Awaitable<void>,
    ): this;

    prependListener<E extends keyof L>(
        event: E,
        listener: (...args: L[E]) => Awaitable<void>,
    ): this;
    prependListener<S extends string | symbol>(
        event: Exclude<S, keyof L>,
        listener: (...args: any[]) => Awaitable<void>,
    ): this;

    prependOnceListener<E extends keyof L>(
        event: E,
        listener: (...args: L[E]) => Awaitable<void>,
    ): this;
    prependOnceListener<S extends string | symbol>(
        event: Exclude<S, keyof L>,
        listener: (...args: any[]) => Awaitable<void>,
    ): this;

    removeListener<E extends keyof L>(event: E, listener: (...args: L[E]) => Awaitable<void>): this;
    removeListener<S extends string | symbol>(
        event: Exclude<S, keyof L>,
        listener: (...args: any[]) => Awaitable<void>,
    ): this;

    removeAllListeners<E extends keyof L>(event?: E): this;
    removeAllListeners<S extends string | symbol>(event?: Exclude<S, keyof L>): this;

    once<E extends keyof L>(event: E, listener: (...args: L[E]) => Awaitable<void>): this;
    once<S extends string | symbol>(
        event: Exclude<S, keyof L>,
        listener: (...args: any[]) => Awaitable<void>,
    ): this;

    on<E extends keyof L>(event: E, listener: (...args: L[E]) => Awaitable<void>): this;
    on<S extends string | symbol>(
        event: Exclude<S, keyof L>,
        listener: (...args: any[]) => Awaitable<void>,
    ): this;

    off<E extends keyof L>(event: E, listener: (...args: L[E]) => Awaitable<void>): this;
    off<S extends string | symbol>(
        event: Exclude<S, keyof L>,
        listener: (...args: any[]) => Awaitable<void>,
    ): this;

    emit<E extends keyof L>(event: E, ...args: L[E]): boolean;
    emit<S extends string | symbol>(event: Exclude<S, keyof L>, ...args: any[]): boolean;

    eventNames(): (keyof L)[];
    eventNames(): (string | symbol)[];

    listenerCount<E extends keyof L>(type: E): number;
    listenerCount<S extends string | symbol>(type: Exclude<S, keyof L>): number;

    listeners<E extends keyof L>(event: E): L[E][];
    listeners<S extends string | symbol>(
        event: Exclude<S, keyof L>,
    ): ((...args: any[]) => Awaitable<void>)[];

    rawListeners<E extends keyof L>(event: E): L[E][];
    rawListeners<S extends string | symbol>(
        event: Exclude<S, keyof L>,
    ): ((...args: any[]) => Awaitable<void>)[];
}

export class TypedEmitter extends EventEmitter {
    public incrementMaxListeners() {
        this.setMaxListeners(this.getMaxListeners() + 1);
    }

    public decrementMaxListeners() {
        this.setMaxListeners(this.getMaxListeners() - 1);
    }
}
