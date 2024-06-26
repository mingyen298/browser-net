
import { plainToInstance, instanceToPlain } from 'class-transformer';
import { Packet } from '../packet/packet';

class WebsocketDaemon {
    private webSocket: WebSocket = null;
    private url: string = '';
    private keepAliveIntervalId: NodeJS.Timeout = null;
    private _isConnected: boolean = false

    private _onPacket: (packet: any) => Promise<void> = null;
    constructor(url: string) {
        this.url = url;
    }
    
    set onPacket(handle:(packet: any) => Promise<void>){
        this._onPacket = handle;
    }

    start() {
        if (this._isConnected) {
            return;
        }
        this.webSocket = new WebSocket(this.url);

        this.webSocket.addEventListener('open', (_) => {
            this._isConnected = true;
            console.log('websocket open');

            this._keepAlive();
        });
        this.webSocket.addEventListener('message', async (event) => {
            console.log("Message from server ", event.data);
            if (this._onPacket != null) {
                await this._onPacket(event.data);
            }
        });

        this.webSocket.addEventListener('close', (_) => {
            this._isConnected = false;
            console.log('websocket connection closed');
            // this._webSocket = null;
            clearInterval(this.keepAliveIntervalId);

        });

    }
    stop() {
        if (!this._isConnected) {
            return;
        }
        this.webSocket.close();

    }

    async send(packet: any) {
        return new Promise((resolve: (value: any) => void, reject: (value: any) => void) => {
            if (!this._isConnected) {
                reject(null);
            }
            this.webSocket.send(JSON.stringify(packet));
            resolve(null);
        });

    }

    _keepAlive() {
        this.keepAliveIntervalId = setInterval(
            () => {
                if (this.webSocket) {
                    this.webSocket.send('keepalive');
                }
            },
            // Set the interval to 20 seconds to prevent the service worker from becoming inactive.
            20 * 1000
        );
    }
}







export abstract class ConnectionBase {
    protected _sessionID: string = '';
    protected _onPacket: (conn: ConnectionBase, packet: Packet) => void = null;
    protected _onDisconnect: (conn: ConnectionBase) => void = null;
    constructor() { 
        // this._onPacket = undefined;
    }
    get sessionID(): string {
        return this._sessionID
    }
    set onPacket(handle: (conn: ConnectionBase, packet: Packet) => void) {
        this._onPacket = handle;
    }
    set onDisconnect(handle: (conn: ConnectionBase) => void) {
        this._onDisconnect = handle;
    }
    protected async onPacketRecived(packData:any){
        if (this._onPacket !== null) {
            const packet = plainToInstance(Packet,packData);
            if (packet instanceof Packet && packet !== null){
                this._onPacket(this, packet);
            }
        }
    }

    protected async onDisconnected(){
        if (this._onDisconnect !== null) {
            this._onDisconnect(this);
        }
    }
    abstract send(packet: Packet): void;
    abstract close(): void;

}

export class Connection extends ConnectionBase {

    private port: chrome.runtime.Port ;
    constructor(port: chrome.runtime.Port) {
        super()
        this.port = port;
        this._sessionID = port.name;
        this.port.onMessage.addListener(this.onPacketRecived.bind(this));
        this.port.onDisconnect.addListener(this.onDisconnected.bind(this));
    }



    send(packet: Packet) {
        this.port.postMessage(instanceToPlain(packet));
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
        this.webSocket.onPacket = this.onPacketRecived.bind(this);

    }

    
    send(packet: Packet) {
        this.webSocket.send(instanceToPlain(packet));
    }

    close() {}
}







