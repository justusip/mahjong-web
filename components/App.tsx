import OverlayLogin from "./overlays/OverlayLogin";
import PageMain from "./PageMain";
import React, {useEffect, useState} from "react";
import {io} from "socket.io-client";
import {Messages} from "../network/Messages";
import UserInfo from "../network/UserInfo";
import {Unity, useUnityContext} from "react-unity-webgl";
import PageTest from "./PageTest";
import SceneRoom from "./PageTest";

export default function App(): React.ReactElement {
    // const [globals, setGlobals] = useSharedState();
    const [me, setMe] = useState<UserInfo | null>(null);

    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    useEffect(() => {
        const serverURL = "ws://localhost:2299";
        const s = io(serverURL);
        setSocket(s);

        s.on("connect", () => {
            console.log(`Connected to ${serverURL}.`);
            setIsConnected(true);
            s.emit(Messages.ROOM_JOIN, {roomCode: "3948"});
            s.once(Messages.ROOM_JOIN, ({error}) => {
                if (error) {
                    console.log(error);
                }
            });
        });
        s.on("disconnect", () => {
            console.log(`Disconnected from ${serverURL}.`);
            setIsConnected(false);
        });

        return () => {
            s.disconnect();
        };
    }, []);

    const [loginOpened, setLoginOpened] = useState(false);

    // if (!me)
    //     return <OverlayLogin onLogin={n => setMe(n)}/>;
    // return <SceneRoom/>;
    return <>
        <OverlayLogin shown={loginOpened} setShown={setLoginOpened} onLogin={u => {
        }}/>
        <PageMain me={me} onLogout={() => {
        }} requestLogin={() => setLoginOpened(true)}/>
        <SceneRoom/>
    </>;
}
