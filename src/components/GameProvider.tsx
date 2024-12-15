import React, {useEffect, useState} from "react";
import {io, Socket} from "socket.io-client";

import Resources from "@/components/game/Resources";
import {ms} from "@/utils/AsyncUtils";
import {MsgboxMsg} from "@/components/global/MsgboxMsg";
import PageType from "@/components/pages/PageType";
import EventType from "@/events/EventType";

export default function GameProvider(props: React.PropsWithChildren) {

    const serverURL = "ws://localhost:8080";
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    const [msg, setMsg] = useState<MsgboxMsg | null>(null);
    const [resLoaded, setResLoaded] = useState(false);

    // const [roomState, setRoomState] = useState<RoomState | null>(null);
    const [page, setPage] = useState(PageType.SPLASH);

    //TODO Auto-Create room and request start room
    useEffect(() => {
        const func = async () => {
            await Resources.load();
            setResLoaded(true);
        };
        func().then();
    }, []);

    // Debug only
    useEffect(() => {
        if (resLoaded && isConnected) {
            socket.emit(EventType.ROOM_CREATE);
            socket.emit(EventType.ROOM_SET_READY, {ready: true});
            socket.emit(EventType.ROOM_START);
        }
    }, [isConnected, resLoaded, socket]);

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

        // socket.on(EventType.ON_ROOM_STATE_UPDATE, (args: { status: RoomState }) => {
        //     setRoomState(args.status);
        //     if (args.status)
        //         setPage(PageType.ROOM);
        // });

        socket.on(EventType.ON_GAME_START, () => {
            setPage(PageType.GAME);
        });

        return () => {
            socket.disconnect();
            socket.removeAllListeners(); //TODO
            setSocket(null);
        };
    }, []);

    const socketRequest = async <T, >(message: string, args?: any): Promise<T | null> => {
        setMsg({progressing: true});
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
        setMsg({progressing: false});
        const {error} = result;
        if (error) {
            setMsg({content: "發生咗個未知嘅問題。請隔一陣或者重新載入頁面後再試過。如果問題持續出現，請聯絡我哋。"});
            return null;
        }
        return result;
    };

    return <GameContext.Provider value={{
        socket,
        isConnected,
        socketRequest,

        setResourcesLoaded: setResLoaded,
        resourceLoaded: resLoaded,

        setMsg,
        msg,

        page,
        setPage,
        // roomState,
    }}>
        {props.children}
    </GameContext.Provider>;
}

export const GameContext = React.createContext <{
    socket: Socket,
    isConnected: boolean,
    socketRequest: <T, >(message: string, args?: any) => Promise<T | null>,

    resourceLoaded: boolean,
    setResourcesLoaded: (resourcesLoaded: boolean) => void,

    setMsg: (msg: MsgboxMsg | null) => void,
    msg: MsgboxMsg | null

    page: number,
    setPage: (page: number) => void,

    // roomState: RoomState | null,
} | null>(null);
