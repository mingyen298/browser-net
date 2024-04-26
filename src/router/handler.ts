import { ConnectionBase, ConnectionWebsocket } from '../net/connection';
import { Packet } from "../packet/packet";
export abstract class RouterHandlerBase {
    protected abstract _uri: string;
    constructor() { }
    get uri() { return this._uri }
    abstract handle(packet: Packet, otherArg?: any): Packet;
}

export class ExampleHandler extends RouterHandlerBase {

    protected _uri: string = ExampleHandler.name;
    constructor() {
        super();
    }
    handle(packet: Packet, otherArg?: any): Packet {
        console.log(this.uri, packet);
        packet.response = { result: 'ok!' };
        return packet;
    }
}



export class ProxyExampleHandler extends RouterHandlerBase {

    protected _uri: string = ProxyExampleHandler.name;
    constructor() {
        super();
    }
    handle(packet: Packet, otherArg?: any): Packet {
        const webscoketConn: ConnectionBase = otherArg;
        // console.log(this.uri, packet);
        webscoketConn.send(packet);
        // packet.response = { result: 'ok!' }
        return null;
    }
}
