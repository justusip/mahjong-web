import React, {useContext, useState} from "react";

import Frag from "./Frag";
import {GameContext} from "../GameProvider";
import IntrinsicButton from "../generics/IntrinsicButton";
import TileDialogue from "../generics/TileDialogue";
import TileTextbox from "../generics/TileTextbox";
import Page from "../Page";
import {Messages} from "../../network/Messages";

export default function FragJoinRoom(props: {
    in: boolean
}): React.ReactElement {
    const ctx = useContext(GameContext);

    const [code, setCode] = useState("");

    const onJoinRoom = async () => {
        await ctx.socketRequest(Messages.ROOM_JOIN, {code});
    };

    return <Frag in={props.in}
                 header="加入房間"
                 onBack={() => ctx.setPage(Page.JOIN_OR_CREATE_ROOM)}
                 className="place-items-center place-content-center">
        <TileDialogue in={true} header="輸入房號">
            請輸入四位數字嘅房號。
            <TileTextbox value={code} onChange={e => setCode(e.target.value)}/>
            <IntrinsicButton disabled={code === ""} onClick={onJoinRoom}>確定</IntrinsicButton>
        </TileDialogue>
    </Frag>;
}
