import { type WebSocketOptions, WebSocketManager, PresenceData } from '@paqujs/ws';
import { TypedEmitter } from '@paqujs/shared';
import {
    type Client,
    type WebSocketHandlerEvents,
    type GatewayRequestGuildMembersData,
    type GatewayVoiceStateUpdateData,
    ClientApplication,
    ClientUser,
    UnavailableGuild,
} from '../../index';
import * as Actions from './actions/index';
import { GatewayOpcodes } from 'discord-api-types/v10';

export class WebSocketHandler extends TypedEmitter<WebSocketHandlerEvents> {
    public client: Client;
    #manager: WebSocketManager;

    public constructor(client: Client, options: Omit<WebSocketOptions, 'rest'>) {
        super();

        this.client = client;
        this.#manager = new WebSocketManager({ rest: client.rest, ...options });

        this.#manager.on('ready', ({ d }) => {
            this.client.user = new ClientUser(this.client, d.user);
            this.client.application = new ClientApplication(this.client, d.application);

            d.guilds.forEach((guild) => {
                this.client.caches.guilds.unavailables.set(
                    guild.id,
                    new UnavailableGuild(this.client, guild),
                );
            });

            this.emit('ready', this.client);
        });

        this.#manager.on('debug', (message) => this.emit('debug', message));
        this.#manager.on('shardClosed', (...args) => this.emit('shardClosed', ...args));
        this.#manager.on('shardDeath', (...args) => this.emit('shardDeath', ...args));
        this.#manager.on('shardError', (...args) => this.emit('shardError', ...args));
        this.#manager.on('shardResumed', (...args) => this.emit('shardResumed', ...args));
        this.#manager.on('shardReady', (shard) => this.emit('shardReady', shard));
        this.#manager.on('shardReconnect', (shard) => this.emit('shardReconnect', shard));
        this.#manager.on('shardSpawn', (shard) => this.emit('shardSpawn', shard));

        this.#manager.on('raw', (payload) => {
            if (payload.op === GatewayOpcodes.Dispatch && payload.t) {
                const _action = Actions[payload.t];

                if (_action) {
                    const action = new _action();

                    action.handler = this;
                    action.handle(payload, this);
                }
            }
        });
    }

    public get ping() {
        return this.#manager.ping;
    }

    public get uptime() {
        return this.#manager.uptime;
    }

    public get uptimeTimestamp() {
        return this.#manager.uptimeTimestamp;
    }

    public get shardQueue() {
        return this.#manager.shardQueue;
    }

    public get shardList() {
        return this.#manager.shardList;
    }

    public get shards() {
        return this.#manager.shards;
    }

    public get token() {
        return this.#manager.token;
    }

    public get manager(): Readonly<WebSocketManager> {
        return this.#manager;
    }

    public getGatewayBot() {
        return this.#manager.getGatewayBot();
    }

    public broadcast(payload: any) {
        return this.#manager.broadcast(payload);
    }

    public broadcastEval<T>(script: string): Promise<T[]> {
        return this.#manager.broadcastEval<T>(script);
    }

    public bulkRequestGuildMembers(data: GatewayRequestGuildMembersData, shardId?: number) {
        return this.#manager.bulkRequestGuildMembers(data, shardId);
    }

    public bulkUpdatePresence(data: PresenceData, shardId?: number) {
        return this.#manager.bulkUpdatePresence(data, shardId);
    }

    public bulkUpdateVoiceState(data: GatewayVoiceStateUpdateData, shardId?: number) {
        return this.#manager.bulkUpdateVoiceState(data, shardId);
    }

    public checkReady() {
        return this.#manager.checkReady();
    }

    public connect(token?: string) {
        return this.#manager.connect(token);
    }

    public destroy() {
        return this.#manager.destroy();
    }
}
