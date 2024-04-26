import * as net from '../net/net'

import { ConnectionWebsocket, ConnectionBase } from '../net/connection';

import { Packet, PacketStatus } from "../packet/packet";
import { RouterHandlerBase, ExampleHandler , ProxyExampleHandler } from './handler';
import { Mutex } from '../utils';
export class RouterBase {

    protected sessions = new Map<string, ConnectionBase>();
    protected handlers = new Map<string, RouterHandlerBase>();
    protected packetTable = new Map<string, string>();
    private lock = new Mutex();
    constructor() { }

    protected init(): void { }

    protected processConnection(conn: ConnectionBase) {
        conn.onPacket = this.processPacket.bind(this);
        this.sessions.set(conn.sessionID, conn);

    }


    private async processPacket(conn: ConnectionBase, packet: Packet): Promise<void> {
        await new Promise(async (resolve) => {

            await this.lock.withLock(async () => {
                if (this.packetTable.has(packet.id)) {//如果packet id已經存在table中，表示packet可能撞到id或是packet是經過代理處理完成的封包
                    if (packet.status === PacketStatus.Finished) {//判斷是否為代理處理完成的封包
                        const originSessionID = this.packetTable.get(packet.id);
                        this.sessions.get(originSessionID).send(packet);
                    }
                } else {
                    if (packet.status === PacketStatus.Rising) {
                        packet.status = PacketStatus.Processing;
                    }
                    this.packetTable.set(packet.id, conn.sessionID);
                    const p = this.handle(packet);
                    
                    if (p instanceof Packet && p !== null) {
                        p.status = PacketStatus.Finished;
                        conn.send(p);
                    }
                }
                this.packetTable.delete(packet.id);
            })


            resolve(null);

        });

    }

    protected handle(packet: Packet): Packet {
        throw new Error("Method not implemented.");
    }

    addHandler(handler: RouterHandlerBase) {
        this.handlers.set(handler.uri, handler);
    }

    run() {
        net.Listen(this.processConnection.bind(this));

        this.init();

    }
}


export class Router extends RouterBase {

    constructor() {
        super();
    }
    protected override init(): void {
        console.log('Router is running');
    }
    protected override handle(packet: Packet): Packet {

        if (this.handlers.has(packet.uri)){
            return this.handlers.get(packet.uri)!.handle(packet);
        }
        return null;
    }

}


export class ProxyRouter extends RouterBase {
    protected webscoketConn: ConnectionBase;
    constructor() {
        super();
    }
    protected override init(): void {
        this.webscoketConn = new ConnectionWebsocket();
        this.processConnection(this.webscoketConn);
        console.log('Router is running');
    }

    protected override handle(packet: Packet):Packet {
        if (this.handlers.has(packet.uri)){
            return this.handlers.get(packet.uri)!.handle(packet, this.webscoketConn);
        }
        return null;
        
    }

}


export { RouterHandlerBase, ExampleHandler , ProxyExampleHandler }