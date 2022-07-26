import React, {useEffect, useState} from "react";
import {io, Socket} from "socket.io-client";

import Resources from "./game/Resources";
import Page from "./Page";
import {Messages} from "../network/Messages";
import RoomStatus from "../types/RoomStatus";
import {ms} from "../utils/Delay";

export default function GameProvider(props: React.PropsWithChildren) {

    const serverURL = "ws://localhost:2299";
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    const [isProgressing, setIsProgressing] = useState(false);
    const [errorShown, setErrorShown] = useState(false);
    const [errorCode, setErrorCode] = useState(null);

    const [page, setPage] = useState(Page.SPLASH);

    const [roomStatus, setRoomStatus] = useState<RoomStatus | null>(null);

    useEffect(() => {
        (async () => {
            await Resources.load();
            // setPage(Page.TITLE);
            setPage(Page.GAME);
        })();
    }, []);

    const socketRequest = async <T, >(message: string, args?: any): Promise<T | null> => {
        setIsProgressing(true);
        const result = await Promise.race<any>([
            (async () => {
                await ms(1000);
                return {error: "ERROR_IO_TIMEOUT"};
            })(),
            new Promise(r => {
                socket.emit(message, args);
                socket.once(message, (ret: any) => r(ret));
            })
        ]);
        await ms(200); //TODO lol
        setIsProgressing(false);
        const {error} = result;
        if (error) {
            setErrorCode(error);
            setErrorShown(true);
        }
        return result;
    };

    useEffect(() => {
        const socket = io(serverURL);
        setSocket(socket);

        socket.on("connect", () => {
            console.log(`Connected to ${serverURL}.`);
            setIsConnected(true);
        });
        socket.on("disconnect", () => {
            console.log(`Disconnected from ${serverURL}.`);
            setIsConnected(false);
        });

        socket.on(Messages.ON_ROOM_UPDATE, (args: { status: RoomStatus }) => {
            setRoomStatus(args.status);
            if (args.status)
                setPage(Page.ROOM);
        });

        socket.on(Messages.ON_ROOM_START, () => {
            setPage(Page.GAME);
        });

        // socket.on(Messages.ON_GAME_START, async (
        //     pid: number,
        //     names: string[]
        // ) => {
        //     table.onRoomStart(pid);
        //     socket.emit(Messages.DECIDE_READY);
        // });

        return () => {
            socket.disconnect();
            socket.removeAllListeners();
        };
    }, []);

    return <GameContext.Provider value={{
        socket, isConnected, socketRequest,
        isProgressing, errorShown, setErrorShown, errorCode,
        page, setPage,
        roomStatus,
    }}>{props.children}</GameContext.Provider>;
}

export const GameContext = React.createContext <{
    socket: Socket,
    isConnected: boolean,
    socketRequest: (event: string, ...args: unknown[]) => void,

    isProgressing: boolean,
    errorShown: boolean,
    setErrorShown: (errorShown: boolean) => void
    errorCode: string | null,

    page: number,
    setPage: (page: number) => void,

    roomStatus: RoomStatus | null,
} | null>(null);
