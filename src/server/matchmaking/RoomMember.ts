import {Socket} from "socket.io";

export class RoomMember {
    name: string = "??";
    ready: boolean = false;
    socket: Socket | null = null;

    constructor(socket: Socket | null, ready: boolean) {
        this.socket = socket;
        this.ready = ready;

        if (!this.socket) {
            this.name = `機械貓-${Math.floor(1000 + Math.random() * 9000).toString()}`;
        }
    }

    isHuman(): boolean {
        return !!this.socket;
    }
}
