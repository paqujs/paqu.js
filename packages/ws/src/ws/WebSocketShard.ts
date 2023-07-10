import { TextDecoder } from 'node:util';
import { setTimeout as sleep } from 'node:timers/promises';
import { TypedEmitter } from '@paqujs/shared';
import { PresenceDataResolver } from '@paqujs/resolvers';
import { WebSocket } from 'ws';
import {
    type GatewayRequestGuildMembersData,
    type GatewayVoiceStateUpdateData,
    type GatewayReceivePayload,
    type GatewayReadyDispatch,
    GatewayOpcodes,
    GatewayCloseCodes,
} from 'discord-api-types/v10';
import type { WebSocketManager, GatewayCloseCodesResolvable, PresenceData } from '../index';

let erlpack: any;
let zlib: any;

try {
    erlpack = require('erlpack');
} catch {
    erlpack = null;
}

try {
    zlib = require('zlib-sync');
} catch {
    zlib = null;
}

export type WebSocketStatus = 'Idle' | 'Ready' | 'Connecting' | 'Reconnecting' | 'Closed';

export interface WebSocketCleanupOptions {
    hard?: boolean;
    removeManagerListeners?: boolean;
    removeSocketListeners?: boolean;
    resetReadyTimestamp?: boolean;
}

export interface WebSocketShardEvents {
    ready: [data: GatewayReadyDispatch];
    close: [code: number, reason: string];
    resumed: [replayed: number];
    error: [error: Error];
}

export class WebSocketShard extends TypedEmitter<WebSocketShardEvents> {
    public socket: WebSocket | null;
    public inflate: any = undefined;
    public lastHeartbeat = -1;
    public lastHeartbeatAcked = false;
    public lastHeartbeatAck = -1;
    // eslint-disable-next-line no-undef
    public heartbeatInterval: NodeJS.Timer | null = null;
    public sequence = -1;
    public closeSequence = 0;
    public sessionId: string | null = null;
    public manager: WebSocketManager;
    public id: number;
    public eventsAppended = false;
    public readyTimestamp = -1;
    public status: WebSocketStatus = 'Idle';
    public packetQueue = 0;
    public resumeURL: string | null;

    public constructor(manager: WebSocketManager, id: number) {
        super();

        this.manager = manager;
        this.id = id;
        this.socket = null;

        if (!!zlib && this.manager.options.compress) {
            this.inflate = new zlib.Inflate({
                chunkSize: 65535,
                to: this.encoding === 'json' ? 'string' : '',
                flush: zlib.Z_SYNC_FLUSH,
            });
        }
    }

    public get readyAt() {
        return new Date(this.readyTimestamp);
    }

    public get uptime() {
        return this.readyTimestamp === -1 ? 0 : Date.now() - this.readyTimestamp;
    }

    public get uptimeAt() {
        return new Date(this.uptime);
    }

    public get ping() {
        return this.lastHeartbeatAck - this.lastHeartbeat;
    }

    public checkReady() {
        if (
            this.socket &&
            this.readyTimestamp > 0 &&
            this.status === 'Ready' &&
            this.socket.readyState === WebSocket.OPEN
        ) {
            return true;
        }

        return false;
    }

    public connect() {
        if (this.checkReady()) {
            return false;
        }

        this.status = 'Connecting';
        this.socket = new WebSocket(this.endpoint, { handshakeTimeout: 30000 });

        this.socket.on('error', (error) => this.emit('error', error));
        this.socket.on('open', () => this.socket.ping());

        this.socket.on('message', (data: any) => {
            const resolved = this.deserialize(data) as GatewayReceivePayload;

            if (!resolved) {
                return;
            }

            const { op, d, t, s } = resolved;

            if (s > this.sequence) {
                this.sequence = s;
            }

            this.manager.emit('raw', { ...resolved, shard_id: this.id });

            switch (op) {
                case GatewayOpcodes.Hello:
                    this.setHeartbeatTimer(d.heartbeat_interval);
                    this.identify();
                    break;
                case GatewayOpcodes.Heartbeat:
                    this.manager.emit(
                        'debug',
                        `[WS]: Shard ${this.id} received a heartbeat request`,
                    );
                    this.sendHeartbeat();
                    break;
                case GatewayOpcodes.HeartbeatAck:
                    this.manager.emit('debug', `[WS]: Shard ${this.id} acknowledged heartbeat`);
                    this.heartbeatAck(true);
                    break;
                case GatewayOpcodes.InvalidSession:
                    if (d) {
                        this.reconnect();
                    } else {
                        this.close(1000, true, {
                            hard: true,
                            removeManagerListeners: false,
                            removeSocketListeners: true,
                            resetReadyTimestamp: true,
                        });
                    }
                    break;
                case GatewayOpcodes.Reconnect:
                    this.reconnect();
                    break;
                case GatewayOpcodes.Dispatch:
                    switch (t) {
                        case 'READY':
                            this.readyTimestamp = Date.now();
                            this.sessionId = d.session_id;
                            this.status = 'Ready';
                            this.resumeURL = d.resume_gateway_url;

                            this.sendHeartbeat();
                            this.emit('ready', resolved);
                            break;
                        case 'RESUMED':
                            this.heartbeatAck();
                            this.sendHeartbeat();

                            this.emit('resumed', this.sequence - this.closeSequence);
                            break;
                    }

                    this.manager.emit(
                        'debug',
                        `[WS]: Shard ${this.id} received a dispatch event: ${t}`,
                    );
                    break;
            }
        });

        this.socket.on('close', (code, reason) => {
            let _reason = reason.toString('utf-8');

            this.closeSequence = this.sequence;
            this.status = 'Closed';

            if (code === 1000 && !_reason.length) {
                _reason = 'Requested by client';
            }

            if (!_reason) {
                _reason = 'Unknown';
            }

            this.emit('close', code, _reason);

            switch (code) {
                case GatewayCloseCodes.InvalidShard:
                case GatewayCloseCodes.ShardingRequired:
                case GatewayCloseCodes.InvalidAPIVersion:
                case GatewayCloseCodes.InvalidIntents:
                case GatewayCloseCodes.DisallowedIntents:
                case GatewayCloseCodes.AuthenticationFailed:
                    throw new Error(_reason);
            }
        });

        return true;
    }

    public cleanup(
        {
            hard,
            removeManagerListeners,
            removeSocketListeners,
            resetReadyTimestamp,
        }: WebSocketCleanupOptions = {
            hard: false,
            removeManagerListeners: false,
            removeSocketListeners: true,
            resetReadyTimestamp: true,
        },
    ) {
        this.lastHeartbeat = -1;
        this.lastHeartbeatAck = -1;
        this.lastHeartbeatAcked = false;
        this.inflate = null;

        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval!);
            this.heartbeatInterval = null;
        }

        if (!!zlib && this.manager.options.compress) {
            this.inflate = new zlib.Inflate({
                chunkSize: 65535,
                to: this.encoding === 'json' ? 'string' : '',
                flush: zlib.Z_SYNC_FLUSH,
            });
        }

        if (resetReadyTimestamp) {
            this.readyTimestamp = -1;
        }

        if (removeManagerListeners) {
            this.removeAllListeners();
            this.eventsAppended = false;
        }

        if (removeSocketListeners && this.socket) {
            this.socket.removeAllListeners();
        }

        if (hard) {
            this.socket = null;
            this.sequence = -1;
            this.sessionId = null;
            this.socket = null;
        }
    }

    public close(
        code: GatewayCloseCodesResolvable,
        cleanup = true,
        cleanupOptions: WebSocketCleanupOptions = {},
    ) {
        if (typeof code === 'string') {
            code = GatewayCloseCodes[code];
        }

        this.socket?.close(code);

        if (cleanup) {
            this.cleanup(cleanupOptions);
        }
    }

    public resume() {
        if (!this.sessionId) {
            this.identify();
        } else {
            this.manager.emit('debug', `[WS]: Resuming shard ${this.id}...`);
            this.send({
                op: GatewayOpcodes.Resume,
                d: {
                    token: this.manager.token!,
                    session_id: this.sessionId,
                    seq: this.sequence,
                },
            });
        }
    }

    public setHeartbeatTimer(ms: number) {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
        }

        this.heartbeatInterval = setInterval(() => {
            this.sendHeartbeat();
        }, ms);
    }

    public sendHeartbeat() {
        this.lastHeartbeatAcked = false;
        this.lastHeartbeat = Date.now();

        this.manager.emit('debug', `[WS]: Sending heartbeat to shard ${this.id}...`);
        this.send({ op: GatewayOpcodes.Heartbeat, d: this.sequence });
    }

    public heartbeatAck(updatePing = false) {
        this.lastHeartbeatAcked = true;

        if (updatePing) {
            this.lastHeartbeatAck = Date.now();
        }
    }

    public identify() {
        if (this.sessionId) {
            this.resume();
        } else {
            this.manager.emit('debug', `[WS]: Identifying shard ${this.id}...`);
            this.send({
                op: GatewayOpcodes.Identify,
                d: {
                    token: this.manager.token!,
                    intents: this.manager.options.intents!,
                    large_threshold: this.manager.options.largeThreshold,
                    compress: !!zlib && this.manager.options.compress,
                    presence: this.manager.options.presence,
                    properties: {
                        ...this.manager.options.properties,
                        browser: 'addox',
                        device: 'addox',
                    },
                    shard: [
                        this.id,
                        process.env.CLUSTER_COUNT
                            ? +process.env.CLUSTER_COUNT * +process.env.SHARD_PER_CLUSTER
                            : this.manager.shardList.length,
                    ],
                },
            });
        }
    }

    public get pack() {
        return this.encoding === 'json' ? JSON.stringify : erlpack.pack;
    }

    public send(data: any) {
        if (++this.packetQueue > 2) {
            sleep(1000).then(() => {
                this.socket.send(this.pack(data));
                this.packetQueue--;
            });
        } else {
            this.socket.send(this.pack(data));
            this.packetQueue--;
        }
    }

    public updatePresence(data: PresenceData) {
        this.send({
            op: GatewayOpcodes.PresenceUpdate,
            d: PresenceDataResolver(data),
        });
    }

    public unpack(data: any) {
        if (this.encoding === 'json') {
            if (typeof data !== 'string') {
                data = new TextDecoder().decode(data);
            }

            return JSON.parse(data);
        } else {
            if (!Buffer.isBuffer(data)) {
                data = Buffer.from(new Uint8Array(data));
            }

            return erlpack.unpack(data);
        }
    }

    public deserialize(data: any) {
        if (data instanceof ArrayBuffer) {
            data = new Uint8Array(data);
        }

        if (!!zlib && this.manager.options.compress) {
            const isFlush = this.isFlush(data);

            this.inflate.push(data, isFlush && zlib.Z_SYNC_FLUSH);

            if (!isFlush) return null;

            data = this.inflate.result;
        }

        try {
            data = this.unpack(data);
        } catch {
            data = null;
        }

        return data;
    }

    public get endpoint() {
        let baseEndpoint = this.resumeURL || 'wss://gateway.discord.gg';

        baseEndpoint += `?v=${this.manager.options.version}`;
        baseEndpoint += `&encoding=${this.encoding}`;

        if (!!zlib && this.manager.options.compress) {
            baseEndpoint += `&compress=zlib-stream`;
        }

        return baseEndpoint;
    }

    public get encoding() {
        return erlpack ? 'etf' : 'json';
    }

    public isFlush(data: any) {
        return (
            data.length >= 4 &&
            data[data.length - 4] === 0x00 &&
            data[data.length - 3] === 0x00 &&
            data[data.length - 2] === 0xff &&
            data[data.length - 1] === 0xff
        );
    }

    public eval<T>(script: string): T {
        return eval(script);
    }

    public requestGuildMembers(data: GatewayRequestGuildMembersData) {
        this.send({
            op: GatewayOpcodes.RequestGuildMembers,
            d: data,
        });
    }

    public updateVoiceState(data: GatewayVoiceStateUpdateData) {
        this.send({
            op: GatewayOpcodes.VoiceStateUpdate,
            d: data,
        });
    }

    public async respawn() {
        return await this.manager.respawn(this.id);
    }

    public async reconnect() {
        return await this.manager.reconnect(this.id);
    }
}
