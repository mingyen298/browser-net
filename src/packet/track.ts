import { Packet } from "./packet";
class TaskCompletionSource {
    private _setResult: (value: unknown) => void = null;
    private _result: any = null;
    private _task: Promise<unknown> = null;
    constructor() {


        this._task = new Promise((resolve) => {
            this._setResult = resolve;
        }).then((result) => {
            this._result = result;
        });

    }
    setResult(value: unknown) {
        this._setResult(value);
    }

    get result(): any {
        return this._result;
    }

    get task(): Promise<unknown> {
        return this._task;
    }

}


export class PacketTrack {
    packet:Packet = null;
    private track:TaskCompletionSource = new TaskCompletionSource()
    constructor(packet:Packet) {    
        this.packet = packet;
    }

    startTrack() {
        this.track = new TaskCompletionSource();
        return this.track;
    }
    /**
     * @param {Packet} packet 
     */
    finish(packet:Packet = null) {
        if (packet !== null) {
            this.packet.content = packet.content;
            this.packet.status = packet.status;
        }
        this.track.setResult(true);
    }
}