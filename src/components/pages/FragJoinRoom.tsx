import React, {useContext, useState} from "react";

import Frag from "./Frag";
import {GameContext} from "../GameProvider";
import IntrinsicButton from "../generic/IntrinsicButton";
import CenterDialog from "../generic/CenterDialog";
import Textbox from "../generic/Textbox";
import PageType from "./PageType";
import Messages from "@/network/Messages";
import Button from "../generic/Button";

export default function FragJoinRoom(props: {
    in: boolean
}): React.ReactElement {
    const ctx = useContext(GameContext);

    const [code, setCode] = useState("");

    const onJoinRoom = async () => {
        await ctx.socketRequest(Messages.ROOM_JOIN, {code});
    };

    const onCreateRoom = async () => {
        await ctx.socketRequest(Messages.ROOM_CREATE);
    };

    return <Frag in={props.in}
                 header="私人牌局"
                 onBack={() => ctx.setPage(PageType.TITLE)}
                 className="place-items-center place-content-center">
        <CenterDialog in={true} header="加入房間">
            請輸入四位數字嘅房號。
            <Textbox value={code} onChange={e => setCode(e.target.value)}/>
            <IntrinsicButton disabled={code === ""} onClick={onJoinRoom}>確定</IntrinsicButton>
            <Button onClick={onCreateRoom}>創建房間</Button>
        </CenterDialog>
    </Frag>;
}
