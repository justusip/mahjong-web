import {Socket} from "socket.io";

import {RoomMember} from "./RoomMember";
import Game from "@/server/logic/Game";
import KongGame from "@/server/logic/KongGame";
import ConsolePlayer from "@/server/players/ConsolePlayer";
import SocketPlayer from "@/server/players/SocketPlayer";
import EventType from "@/events/EventType";
import RobotPlayer from "@/server/players/RobotPlayer";
import Player from "@/server/players/Player";
import RoomStatus from "@/server/matchmaking/RoomStatus";

export default class Room {
    code: string = Math.floor(1000 + Math.random() * 9000).toString();
    mode: "hk" | "jp" | "jp3" | "tw" | "bw";
    members: RoomMember[] = [];

    game: Game | null = null;
    roomStatus: RoomStatus = RoomStatus.WAITING;

    constructor(code?: string) {
        if (code)
            this.code = code;
    }

    people(): RoomMember[] {
        return this.members.filter(p => p.isHuman());
    }

    personOf(socket: Socket) {
        return this.people().find(p => p.socket === socket);
    }

    bots(): RoomMember[] {
        return this.members.filter(p => !p.isHuman());
    }

    isFull(): boolean {
        return this.members.length === 4; //TODO
    }

    notifyRoomStatus() {
        for (const person of this.people()) {
            person.socket.emit(EventType.ON_ROOM_STATE_UPDATE, {
                status: {
                    code: this.code,
                    mode: this.mode,
                    players: this.members.map(p => ({name: p.name, ready: p.ready})),
                    // iAmOwner: this.isOwner(person.socket) // TODO Remove this field to minimize data to be sent.
                    // The client can recognise if it's the owner of the room anyway by matching the players[0]'s id with its
                    iAm: this.members.indexOf(this.people().find(p => person.socket === p.socket))
                }
            });
        }
    }

    isAllReady(): boolean {
        return this.people().filter((o, n) => n !== 0).every(p => p.ready);
    }

    start() {
        for (const person of this.people()) {
            person.socket.emit(EventType.ON_GAME_START);
        }

        this.roomStatus = RoomStatus.IN_GAME;

        const players: Player[] = [
            new ConsolePlayer("Console")
        ];
        const playersToAdd = 4 - players.length;
        for (let i = 0; i < playersToAdd; i++) {
            const member = this.members[i];
            if (member.isHuman()) {
                const p = new SocketPlayer(member.name, "0a2f2e15-bd30-4613-bde5-ad4f81f84dc3"); //TODO hardcoded currently
                p.attach(member.socket);
                players.push(p);
            } else {
                players.push(new RobotPlayer(member.name));
            }
        }

        this.game = new KongGame(players);
        this.game.runFull();
    }
}
