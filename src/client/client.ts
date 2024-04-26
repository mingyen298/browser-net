import { ConnectionBase } from "../net/connection";
import * as net from '../net/net';
import { PacketController } from "../packet/controller";
import { Packet, PacketStatus } from "../packet/packet";

export class Client {
    private conn: ConnectionBase = null;
    private handle: (packet: Packet) => void = null;
    private packetController: PacketController = new PacketController();
    constructor() {
        this.conn = net.Dial();
    }
    async processPacket(conn: ConnectionBase, packet: Packet): Promise<void> {
        await this.packetController.processPacket(packet);
        if (this.handle !== null) {
            this.handle(packet);
        }

    }
    listenPacket(handle: (packet: Packet) => Promise<void> = null): void {
        this.handle = handle;
        this.conn.onPacket = this.processPacket.bind(this);

    }
    shot(uri: string, content: any): void {
        const packet = new Packet(uri, content, PacketStatus.Pass);
        this.conn.send(packet);
    }

    async send(uri: string, content: any): Promise<Packet> {
        var p: Packet = null;
        const packet = new Packet(uri, content, PacketStatus.Rising);

        const track = await this.packetController.registerPacket(packet);
        if (track === null) {
            return null;
        }
        this.conn.send(packet);
        await track.startTrack().task;
        p = track.packet;
        return p;
    }
}

