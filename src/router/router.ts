import * as net from '../net/net'

import { ConnectionWebsocket, ConnectionBase } from '../net/connection';


export class Router {
    private sessions = new Map<string, ConnectionBase>();
    constructor() {


    }

    init() {
        const webscoketConn = new ConnectionWebsocket();
        this.processConnection(webscoketConn);
        net.Listen(this.processConnection.bind(this));

    }

    private processConnection(conn: ConnectionBase) {
        conn.onPacket = this.processPacket.bind(this);
        this.sessions.set(conn.sessionID, conn);

    }
    private processPacket(conn: ConnectionBase, p: any) {
        // const packet = p as PacketType;
        console.log(p);

    }

    start() {
        this.init();

    }
}
