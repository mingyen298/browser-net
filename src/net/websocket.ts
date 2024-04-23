


export class WebsocketDaemon {
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








// export { Websocket };
