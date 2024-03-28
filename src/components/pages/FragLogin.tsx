import React, {useContext, useState} from "react";
import Textbox from "../generic/Textbox";
import Button from "../generic/Button";
import {GameContext} from "../GameProvider";
import PageType from "./PageType";
import EventType from "@/events/EventType";
import Dialog from "@/components/generic/Dialog";


export default function FragLogin(props: {}): React.ReactElement {
    const ctx = useContext(GameContext);
    const [loginShown, setLoginShown] = useState(true);

    const [defaultUsername, setDefaultUsername] = useState(`訪客-${Math.floor(Math.random() * 9000) + 1000}`);
    const [username, setUsername] = useState("");
    const onLogin = async () => {
        if (username === "")
            setUsername(defaultUsername);
        const o = await ctx.socketRequest(EventType.AUTHENTICATE, {username: username});
        if (!o) return;
        setLoginShown(false);
        ctx.setPage(PageType.TITLE);
    };

    return <Dialog
        shown={loginShown}
        title={"歡迎"}>
        歡迎喺度同朋友及來自世界各地嘅玩家打香港牌、台灣牌、日本牌等唔同類型嘅麻雀。<br/><br/>
        若要繼續，請先輸入你嘅名稱。
        <Textbox placeholder={defaultUsername} value={username} onChange={e => setUsername(e.target.value)}/>
        <Button onClick={onLogin}>OK</Button>
    </Dialog>;
};

