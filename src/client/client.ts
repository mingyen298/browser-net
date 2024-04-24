import { ConnectionBase } from "../net/connection";
import * as net from '../net/net';
import { BrowserPacket } from "../packet/packet";

export class Client {
    private conn: ConnectionBase = null;
    constructor() {
        this.conn = net.Dial();;
    }
    listenPacket(processPacketHandle: (conn: ConnectionBase, packet: BrowserPacket) => Promise<void>): void {
        this.conn.onPacket = processPacketHandle;
    }
    send(uri:string,content: any,pass:boolean=false): void {
        this.conn.send({
            pass:pass,
            uri: uri,
            content: content
        } );
    }
}

