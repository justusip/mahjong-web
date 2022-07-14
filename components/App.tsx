import OverlayLogin from "./overlays/OverlayLogin";
import PageMain from "./PageMain";
import React, {useEffect, useState} from "react";
import UserInfo from "../network/UserInfo";
import SceneLobby from "./SceneLobby";
import {Messages} from "../network/Messages";
import {io} from "socket.io-client";
import ServerStatus from "./overlays/ServerStatus";


export default function App(): React.ReactElement {
    const [me, setMe] = useState<UserInfo | null>(null);

    const serverURL = "ws://localhost:2299";
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const socket = io(serverURL);
        setSocket(socket);

        socket.on("connect", () => {
            console.log(`Connected to ${serverURL}.`);
            setIsConnected(true);
            socket.emit(Messages.ROOM_JOIN, {roomCode: "3948"});
            socket.once(Messages.ROOM_JOIN, ({error}) => {
                if (error) {
                    console.log(error);
                }
            });
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

    return <div className={"w-full h-screen overflow-hidden bg-gray-800"}>
        <ServerStatus connected={isConnected}/>
        <OverlayLogin shown={loginOpened} setShown={setLoginOpened} onLogin={u => {
        }}/>
        <PageMain socket={socket}
                  isConnected={isConnected}
                  me={me}
                  onLogout={() => null}
                  onStart={() => alert("wowo")}
                  requestLogin={() => setLoginOpened(true)}/>
        <SceneLobby/>
    </div>;
}
