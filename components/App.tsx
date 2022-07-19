import OverlayLogin from "./overlays/OverlayLogin";
import React, {useEffect, useState} from "react";
import UserInfo from "../network/UserInfo";
import {io} from "socket.io-client";
import ServerStatus from "./overlays/ServerStatus";
import PageMain from "./pages/PageMain";
import PageLoading from "./pages/PageLoading";
import SceneGame from "./game/SceneGame";
import Resources from "./game/Resources";

export default function App(): React.ReactElement {
    const [me, setMe] = useState<UserInfo | null>(null);

    useEffect(() => {
        (async () => {
            await Resources.load();
            setPage(2);
        })();
    });

    const serverURL = "ws://localhost:2299";
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

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

        return () => {
            socket.disconnect();
        };
    }, []);

    const [loginOpened, setLoginOpened] = useState(false);

    const [page, setPage] = useState(0);
    const onStart = () => {
        setPage(2);
    };

    return <div className={"w-screen h-screen overflow-hidden bg-gray-800"}>
        <ServerStatus connected={isConnected}/>
        <OverlayLogin shown={loginOpened} setShown={setLoginOpened} onLogin={u => {
        }}/>
        {
            [
                <PageLoading/>,
                <>
                    <PageMain socket={socket}
                              isConnected={isConnected}
                              me={me}
                              onLogout={() => null}
                              onStart={onStart}
                              requestLogin={() => setLoginOpened(true)}/>
                    {/*<SceneLobby/>*/}
                </>,
                <SceneGame socket={socket}/>
                // <TestTest/>
            ][page]
        }
    </div>;
}
