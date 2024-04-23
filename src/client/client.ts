

import { ConnectionBase } from "../net/connection";
import * as net from '../net/net';

export class Client {
    private conn: ConnectionBase = null;
    constructor() {
        this.conn = net.Dial();;
    }
    listenPacket(processPacketHandle: (conn: ConnectionBase, packet: any) => Promise<void>): void {
        this.conn.onPacket = processPacketHandle;
    }
    send(packet: any): void {
        this.conn.send(packet);
    }
}

