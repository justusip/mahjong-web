import React, {useEffect, useState} from "react";
import FragRoom from "./pages/FragRoom";
import {ms} from "../utils/Delay";
import FragHome from "./pages/FragHome";
import FragJoinOrCreateRoom from "./pages/FragJoinOrCreateRoom";
import FragJoinRoom from "./pages/FragJoinRoom";
import OverlayDialogue from "./pieces/OverlayDialogue";
import UserInfo from "../network/UserInfo";
import {Socket} from "socket.io-client";
import {Messages} from "../network/Messages";
import RoomStatus from "../types/RoomStatus";
import {AiOutlineLoading} from "react-icons/ai";
import TileButton from "./generics/TileButton";

export default function PageMain(props: {
    socket: Socket,
    isConnected: boolean,
    me: UserInfo | null,
    requestLogin: () => void,
    onLogout: () => void,
    onStart: () => void,
}): React.ReactElement {

    const [page, setPageRaw] = useState(0);
    const [roomStatus, setRoomStatus] = useState<RoomStatus | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [errorCode, setErrorCode] = useState(null);
    const [errorShown, setErrorShown] = useState(false);

    const setPage = async (toPage: number) => {
        if (page === toPage)
            return;
        setPageRaw(-1);
        await ms(400);
        setPageRaw(toPage);
    };

    useEffect(() => {
        if (!props.socket)
            return;
        props.socket.on(Messages.ON_ROOM_UPDATE, (args: { status: RoomStatus }) => {
            setRoomStatus(args.status);
            setPage(args.status ? 2 : 0);
        });
        props.socket.on(Messages.ON_ROOM_START, (args: {}) => {
            props.onStart();
        });
        return () => {
            props.socket.off(Messages.ON_ROOM_UPDATE);
            props.socket.off(Messages.ON_ROOM_START);
        };
    }, [page, props.socket]);
    useEffect(() => {
        if (!props.isConnected) {
            setErrorShown(false);
            setRoomStatus(null);
            setPage(0);
        }
    }, [props.isConnected]);

    const showError = (errorCode: string, messages: { [key: string]: string }) => {
        setErrorCode(errorCode);
        setErrorShown(true);
        if (!Object.keys(messages).includes(errorCode)) {
            setErrorMsg("發生咗個未知嘅問題。請隔一陣或者重新載入頁面後再試過。如果問題持續出現，請聯絡我哋。");
        } else {
            setErrorMsg(messages[errorCode]);
        }
    };

    const ask = async <T, >(message: string, args?: any): Promise<T | null> => {
        setIsLoading(true);
        const result = await Promise.race<any>([
            (async () => {
                await ms(1000);
                return {error: "ERROR_IO_TIMEOUT"};
            })(),
            new Promise(r => {
                props.socket.emit(message, args);
                props.socket.once(message, (ret) => r(ret));
            })
        ]);
        await ms(200); //TODO lol
        setIsLoading(false);
        return result;
    };

    const onJoinRoom = async (code: string) => {
        const {error} = await ask(Messages.ROOM_JOIN, {code});
        if (error) {
            showError(error, {ERROR_ROOM_INVALID: "冇呢間房。請確保您打啱個房間編號。", ERROR_ROOM_FULL: "呢間房已經人滿。"});
            return;
        }
    };

    const onCreateRoom = async () => {
        const {error} = await ask(Messages.ROOM_CREATE);
        if (error) {
            showError(error, {});
            return;
        }
    };

    const onLeaveRoom = async () => {
        const {error} = await ask(Messages.ROOM_LEAVE);
        if (error) {
            showError(error, {});
            return;
        }
        setPage(1);
    };

    const onBotAdd = async () => {
        const {error} = await ask(Messages.ROOM_BOT_ADD);
        if (error) {
            showError(error, {});
            return;
        }
    };

    const onPlayerKick = async (playerIdx: number) => {
        const {error} = await ask(Messages.ROOM_KICK, {playerIdx});
        if (error) {
            showError(error, {});
            return;
        }
    };

    const onSetReady = async (ready: boolean) => {
        const {error} = await ask(Messages.ROOM_SET_READY, {ready});
        if (error) {
            showError(error, {});
            return;
        }
    };

    const onGameStart = async () => {
        const {error} = await ask(Messages.ROOM_START, {});
        if (error) {
            showError(error, {});
            return;
        }
    };

    return <div className={"absolute inset-0 z-20 w-full h-full overflow-hidden"}>
        <OverlayDialogue shown={errorShown} centered={true} header={"錯誤"}>
            <div className={"px-2 bg-red-600 text-white"}>錯誤代碼：{errorCode}</div>
            {errorMsg}
            <TileButton onClick={() => setErrorShown(false)}>確定</TileButton>
        </OverlayDialogue>
        <OverlayDialogue shown={isLoading} centered={true}>
            <div className={"flex gap-2 place-items-center"}><AiOutlineLoading className={"animate-spin"}/>載入中</div>
        </OverlayDialogue>
        <FragHome in={page === 0} setPage={setPage} requestLogin={props.requestLogin}/>
        <FragJoinOrCreateRoom in={page === 1}
                              onBack={() => setPage(0)}
                              onCreateRoom={onCreateRoom}
                              onEnterRoom={() => setPage(3)}/>
        <FragRoom in={page === 2}
                  roomStatus={roomStatus}
                  onBack={onLeaveRoom}
                  onBotAdd={onBotAdd}
                  onPlayerKick={onPlayerKick}
                  onSetReady={onSetReady}
                  onGameStart={onGameStart}/>
        <FragJoinRoom in={page === 3}
                      onBack={() => setPage(1)}
                      onJoinRoom={onJoinRoom}/>
    </div>;
}
