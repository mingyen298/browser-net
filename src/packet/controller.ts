
import { Mutex } from '../utils';
import { Packet, PacketStatus } from './packet';
import { PacketTrack } from './track';
export class PacketController {
    private lock: Mutex = new Mutex();
    private trackTable: Map<string, PacketTrack> = new Map<string, PacketTrack>();
    constructor() {

    }

    async registerPacket(packet: Packet): Promise<PacketTrack> {

        var t: PacketTrack = null;

        await this.lock.withLock(async()=>{
            if (packet.status === PacketStatus.Rising) {
                if (this.trackTable.has(packet.id)) {
                    const track = this.trackTable.get(packet.id);
                    track.finish();
                    this.trackTable.delete(packet.id);
                }
                if (!this.trackTable.has(packet.id)) {
                    this.trackTable.set(packet.id, new PacketTrack(packet));
                    t = this.trackTable.get(packet.id);
                }
            }
        });
        
        return t;
    }

    async processPacket(packet: Packet): Promise<Packet | undefined> {
    

        var p: Packet = null;

        await this.lock.withLock(async()=>{
            if (packet.status === PacketStatus.Finished) {
                if (this.trackTable.has(packet.id)) {
                    const track = this.trackTable.get(packet.id);
                    track.finish(packet);
                    this.trackTable.delete(packet.id);
                    p = track.packet;
                }
    
            }
        });
        return p;


    }
}
