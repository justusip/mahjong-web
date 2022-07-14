import {Socket} from "engine.io-client/build/esm-debug";
import {Messages} from "../network/Messages";

export default class Game {
    static ins: Game = new Game();

    serverURL = "ws://localhost:2299";
    socket: Socket;

    constructor() {
        if (Game.ins)
            return Game.ins;
        Game.ins = this;
    }

    connect() {
        console.log(`Connected to ${this.serverURL}.`);
        this.socket.emit(Messages.ROOM_JOIN, {roomCode: "3948"});
        this.socket.once(Messages.ROOM_JOIN, ({error}) => {
            if (error) {
                console.log(error);
            }
        });
    }

    disconnect() {
        console.log(`Disconnected from ${serverURL}.`);
    }
}
