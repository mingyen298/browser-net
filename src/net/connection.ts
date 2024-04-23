import { WebsocketDaemon } from "./websocket";


export abstract class ConnectionBase {
    protected _sessionID: string = '';
    protected _onPacket: (conn: ConnectionBase, packet: any) => void = null;
    protected _onDisconnect: (conn: ConnectionBase) => void = null;
    constructor() { 
        // this._onPacket = undefined;
    }
    get sessionID(): string {
        return this._sessionID
    }
    set onPacket(handle: (conn: ConnectionBase, packet: any) => void) {
        this._onPacket = handle;
    }
    set onDisconnect(handle: (conn: ConnectionBase) => void) {
        this._onDisconnect = handle;
    }

    abstract send(packet: any): void;
    abstract close(): void;

}

export class Connection extends ConnectionBase {

    private port: chrome.runtime.Port ;
    constructor(port: chrome.runtime.Port) {
        super()
        this.port = port;
        this._sessionID = port.name;
        this.port.onMessage.addListener((message) => {
            if (this._onPacket !== null) {
                this._onPacket(this, message);
            }
        });
        this.port.onDisconnect.addListener(() => {
            if (this._onDisconnect !== null) {
                this._onDisconnect(this);
            }

        });
    }



    send(packet: any) {
        this.port.postMessage(packet);
    }

    close() {
        this.port.disconnect();
    }
}


export class ConnectionWebsocket extends ConnectionBase {
    private webSocket: WebsocketDaemon ;
    constructor(url:string = 'ws://0.0.0.0:9000/echo') {
        super();
        this._sessionID = Math.random().toString(16).substring(2, 16);
        this.webSocket = new WebsocketDaemon(url);
        this.webSocket.start();
        this.webSocket.onPacket = async (message) => {
            if (this._onPacket !== null) {
                this._onPacket(this, message);
            }
        }

    }


    send(packet: any) {
        this.webSocket.send(packet);
    }

    close() {}
}







