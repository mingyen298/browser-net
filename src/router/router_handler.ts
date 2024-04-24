import { ConnectionBase } from '../net/connection';
import { BrowserPacket } from "../packet/packet";
export abstract class RouterHandlerBase {
    protected abstract _uri: string;
    constructor() { }
    get uri(){return this._uri}
    abstract handle(conn: ConnectionBase, packet: BrowserPacket,otherArg?:any): void;
}

export class ExampleHandler extends RouterHandlerBase {

    protected _uri: string = ExampleHandler.name;
    constructor() {
        super();
    }
    handle(conn: ConnectionBase, packet: BrowserPacket, otherArg?: any): void {
        console.log(this.uri);
    }
}

