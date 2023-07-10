import { EventEmitter } from 'events';
import type { Awaitable } from '../index';

export type DefaultListener = {
    [event: string]: any[];
};

export type ListenerSignature<L> = {
    [E in keyof L]: L[E] extends [...args: infer A] ? A : never;
};

export declare interface TypedEmitter<L extends ListenerSignature<L> = DefaultListener> {
    addListener<E extends keyof L>(event: E, listener: (...args: L[E]) => Awaitable<any>): this;
    addListener<S extends string | symbol>(
        event: Exclude<S, keyof L>,
        listener: (...args: any[]) => Awaitable<any>,
    ): this;

    prependListener<E extends keyof L>(
        event: E,
        listener: (...args: L[E]) => Awaitable<any>,
    ): this;
    prependListener<S extends string | symbol>(
        event: Exclude<S, keyof L>,
        listener: (...args: any[]) => Awaitable<any>,
    ): this;

    prependOnceListener<E extends keyof L>(
        event: E,
        listener: (...args: L[E]) => Awaitable<any>,
    ): this;
    prependOnceListener<S extends string | symbol>(
        event: Exclude<S, keyof L>,
        listener: (...args: any[]) => Awaitable<any>,
    ): this;

    removeListener<E extends keyof L>(event: E, listener: (...args: L[E]) => Awaitable<any>): this;
    removeListener<S extends string | symbol>(
        event: Exclude<S, keyof L>,
        listener: (...args: any[]) => Awaitable<any>,
    ): this;

    removeAllListeners<E extends keyof L>(event?: E): this;
    removeAllListeners<S extends string | symbol>(event?: Exclude<S, keyof L>): this;

    once<E extends keyof L>(event: E, listener: (...args: L[E]) => Awaitable<any>): this;
    once<S extends string | symbol>(
        event: Exclude<S, keyof L>,
        listener: (...args: any[]) => Awaitable<any>,
    ): this;

    on<E extends keyof L>(event: E, listener: (...args: L[E]) => Awaitable<any>): this;
    on<S extends string | symbol>(
        event: Exclude<S, keyof L>,
        listener: (...args: any[]) => Awaitable<any>,
    ): this;

    off<E extends keyof L>(event: E, listener: (...args: L[E]) => Awaitable<any>): this;
    off<S extends string | symbol>(
        event: Exclude<S, keyof L>,
        listener: (...args: any[]) => Awaitable<any>,
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
    ): ((...args: any[]) => Awaitable<any>)[];

    rawListeners<E extends keyof L>(event: E): L[E][];
    rawListeners<S extends string | symbol>(
        event: Exclude<S, keyof L>,
    ): ((...args: any[]) => Awaitable<any>)[];
}

export class TypedEmitter extends EventEmitter {
    public incrementMaxListeners() {
        this.setMaxListeners(this.getMaxListeners() + 1);
    }

    public decrementMaxListeners() {
        this.setMaxListeners(this.getMaxListeners() - 1);
    }
}
