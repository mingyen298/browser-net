// import * as uuid from 'uuid';

import { uuid } from "../utils";

export enum PacketStatus {
    Default = 0,
    Rising,
    Processing,
    Falling,
    Finished,
    Pass,
    Error
};


export class Packet {
    uri: string = '';
    id: string = '';
    // session_id: string = '';
    content: any;
    response: any;
    status: PacketStatus;
    constructor(uri: string, content: any, status: PacketStatus = PacketStatus.Default) {
        this.id = uuid();
        this.uri = uri;
        // this.session_id=session_id;
        this.content = content;
        this.status = status;
    }
    update(packet: Packet) {
        this.content = packet.content;
        this.status = packet.status;
    }

}