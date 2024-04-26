// import * as uuid from 'uuid';



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
    content: any = {};
    response: any = {};
    status: PacketStatus = PacketStatus.Default;


    constructor(id:string,uri: string, content: any, status: PacketStatus = PacketStatus.Default) {
        this.id = id;
        this.uri = uri;
        // this.session_id=session_id;
        this.content = content;
        this.status = status;
    }
 

    update(packet: Packet) {
        this.response = packet.response;
        this.status = packet.status;
    }
    clone():Packet{
        const packet = new Packet(this.id,this.uri,this.content,this.status);
        packet.response = this.response;
        return packet;
        
    }

}