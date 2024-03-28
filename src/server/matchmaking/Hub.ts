import {Socket} from "socket.io";

import {log} from "@/utils/Log";
import {RoomMember} from "./RoomMember";
import EventType from "@/events/EventType";
import RoomStatus from "@/server/matchmaking/RoomStatus";
import Room from "./Room";

export default class Hub {
    rooms: Room[] = [
        new Room("1111")
    ];

    onSocketConnect(socket: Socket) {
        const address = socket.request.socket.remoteAddress;
        log(`Client ${address} is connected to the hub.`);

        socket.on("disconnect", () => {
            log(`Client ${address} is disconnected from the hub.`);
            leaveRoom(socket);
        });

        // socket.on(Messages.AUTHENTICATE, (
        //     name: string,
        // ) => {
        //     const uuid = uuidv4();
        //     socket.emit(Messages.AUTHENTICATE, {ok: true});
        // });

        socket.on(EventType.AUTHENTICATE, (userID: string, userName: string) => {
            if (socket.data.username) {
                socket.emit(EventType.AUTHENTICATE, {error: "ERROR_ALREADY_AUTHENTICATED"});
                return;
            }
            socket.data.username = userName;
            socket.emit(EventType.AUTHENTICATE, {});
        });

        socket.on(EventType.ROOM_CREATE, () => {
            // 1) Check if player is already at a room
            if (this.getRoomOf(socket)) {
                socket.emit(EventType.ROOM_CREATE, {error: "ERROR_ALREADY_AT_ROOM"});
                return;
            }

            // 2) If not, create a new room and add the player into the room.
            const room = new Room();
            this.rooms.push(room);
            log(`Created room ${room.code}.`);
            room.members.push(new RoomMember(socket, true));
            //TODO temp
            for (let i = 0; i < 3; i++) {
                room.members.push(new RoomMember(null, true));
            }
            room.notifyRoomStatus();
            socket.emit(EventType.ROOM_CREATE, {});
        });

        socket.on(EventType.ROOM_JOIN, (args: {
            code: string
        }) => {
            const room = this.rooms.find(o => o.code === args.code);
            if (!room) {
                socket.emit(EventType.ROOM_JOIN, {error: "ERROR_ROOM_INVALID"});
                return;
            }
            if (room.members.length >= 4) {
                socket.emit(EventType.ROOM_JOIN, {error: "ERROR_ROOM_FULL"});
                return;
            }
            room.members.push(new RoomMember(socket, false));
            socket.emit(EventType.ROOM_JOIN, {});
            room.notifyRoomStatus();
        });

        socket.on(EventType.ROOM_ADD_BOT, (args: {}) => {
            const room = this.getRoomOf(socket);
            if (!room) {
                socket.emit(EventType.ROOM_ADD_BOT, {error: "ERROR_NOT_AT_ROOM"});
                return;
            }
            if (room.members.length >= 4) {
                socket.emit(EventType.ROOM_ADD_BOT, {error: "ERROR_ROOM_FULL"});
                return;
            }
            room.members.push(new RoomMember(null, true));
            socket.emit(EventType.ROOM_ADD_BOT, {});
            room.notifyRoomStatus();
        });

        socket.on(EventType.ROOM_REMOVE_PLAYER, (args: { playerIdx: number }) => {
            const room = this.getRoomOf(socket);
            if (!room) {
                socket.emit(EventType.ROOM_REMOVE_PLAYER, {error: "ERROR_NOT_AT_ROOM"});
                return;
            }
            if (args.playerIdx >= room.members.length || args.playerIdx <= 0) {
                socket.emit(EventType.ROOM_REMOVE_PLAYER, {error: "ERROR_INVALID_PLAYER"});
                return;
            }
            const ghost = room.members[args.playerIdx];
            room.members.splice(args.playerIdx, 1);
            if (ghost.isHuman()) {
                ghost.socket.emit(EventType.ON_ROOM_STATE_UPDATE, {});
            }
            socket.emit(EventType.ROOM_REMOVE_PLAYER, {});
            room.notifyRoomStatus();
        });

        socket.on(EventType.ROOM_UPDATE_CONFIG, (args: {
            gameMode: string,
        }) => {
            const room = this.getRoomOf(socket);
            if (!room) {
                socket.emit(EventType.ROOM_UPDATE_CONFIG, {error: "ERROR_NOT_AT_ROOM"});
                return;
            }
            room.notifyRoomStatus();
            socket.emit(EventType.ROOM_UPDATE_CONFIG, {});
        });

        socket.on(EventType.ROOM_SET_READY, (args: {
            ready: boolean
        }) => {
            const room = this.getRoomOf(socket);
            if (!room) {
                socket.emit(EventType.ROOM_JOIN, {error: "ERROR_ROOM_INVALID"});
                return;
            }
            room.personOf(socket).ready = args.ready;
            log(`Room ${room.code} has ${room.members.count(g => g.ready)}/4 players ready.`);
            room.notifyRoomStatus();
            socket.emit(EventType.ROOM_SET_READY, {});
        });

        socket.on(EventType.ROOM_START, (args: {}) => {
            const room = this.getRoomOf(socket);
            if (!room) {
                socket.emit(EventType.ROOM_START, {error: "ERROR_ROOM_INVALID"});
                return;
            }
            if (!room.isFull()) {
                socket.emit(EventType.ROOM_START, {error: "ERROR_ROOM_INSUFFICIENT_PLAYERS"});
                return;
            }
            if (room.roomStatus !== RoomStatus.WAITING) {
                socket.emit(EventType.ROOM_START, {error: "ERROR_ROOM_ALREADY_PROGRESSING"});
                return;
            }
            log(`Room ${room.code} is now starting the game.`);
            room.start();
            socket.emit(EventType.ROOM_START, {});
        });

        const leaveRoom = (socket: Socket) => {
            const room = this.getRoomOf(socket);
            if (!room) {
                socket.emit(EventType.ROOM_LEAVE, {error: "ERROR_NOT_AT_ROOM"});
                return;
            }

            // 1) Remove the player from his room.
            const ghost = room.people().find(g => g.socket === socket);
            room.members.splice(room.members.indexOf(ghost), 1);

            if (room.people().isEmpty()) {
                // 2) If the room has no human players, delete the room.
                this.rooms.splice(this.rooms.indexOf(room), 1);
                log(`Room ${room.code} is deleted as there is no one left at the room.`);
            } else {
                // 3) Otherwise, promote the first human player as room host
                // and notify the remaining players of the room the status of the room.
                room.members = [...room.people(), ...room.bots()];
                room.people()[0].ready = true;
                room.notifyRoomStatus();
            }

            socket.emit(EventType.ROOM_LEAVE, {});
        };

        socket.on(EventType.ROOM_LEAVE, () => {
            leaveRoom(socket);
        });
    }

    getRoomOf(socket: Socket): Room {
        for (const r of this.rooms)
            for (const player of r.people())
                if (player.socket === socket)
                    return r;
        return null;
    }
}
