import * as net from '../net/net'

import { ConnectionWebsocket, ConnectionBase } from '../net/connection';

import { BrowserPacket } from "../packet/packet";
import { RouterHandlerBase  , ExampleHandler} from './router_handler';

export class RouterBase {

    protected sessions = new Map<string, ConnectionBase>();
    protected handlers = new Map<string, RouterHandlerBase>();

    constructor() { }

    protected init(): void { }

    protected processConnection(conn: ConnectionBase) {
        conn.onPacket = this.processPacket.bind(this);
        this.sessions.set(conn.sessionID, conn);

    }


    protected async processPacket(conn: ConnectionBase, packet: BrowserPacket): Promise<void> { }

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
    protected override async processPacket(conn: ConnectionBase, packet: BrowserPacket): Promise<void> {
        await new Promise((resolve) => {
            this.handlers.get(packet.uri).handle(conn, packet);
            resolve(null);
        });
    }

}


export class CrawlerRouter extends RouterBase {
    protected webscoketConn: ConnectionBase;
    constructor() {
        super();
    }
    protected override init(): void {
        this.webscoketConn = new ConnectionWebsocket();
        this.processConnection(this.webscoketConn);
        console.log('Router is running');
    }
    protected override async processPacket(conn: ConnectionBase, packet: BrowserPacket): Promise<void> {
        await new Promise((resolve) => {
            this.handlers.get(packet.uri).handle(conn, packet,this.webscoketConn);
            resolve(null);
        });
    }

}


export {RouterHandlerBase  , ExampleHandler}