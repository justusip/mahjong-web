import React, {useState} from "react";
import TileDialogue from "../generics/TileDialogue";
import TileTextbox from "../generics/TileTextbox";
import IntrinsicButton from "../generics/IntrinsicButton";
import {ms} from "../../utils/Delay";
import Frag from "./Frag";
import {Socket} from "socket.io-client";

export default function FragJoinRoom(props: {
    in: boolean,
    onBack: () => void,
    onJoinRoom: (code: string) => void
}): React.ReactElement {

    const [code, setCode] = useState("");
    const [page, setPage] = useState(0);
    const toPage = async (page: number) => {
        setPage(-1);
        await ms(100);
        setPage(page);
    };

    const handleSubmit = async () => {
        props.onJoinRoom(code);
    };

    return <Frag in={props.in} header={"加入房間"} onBack={props.onBack}
                 className={"place-items-center place-content-center"}>
        <TileDialogue in={page === 0} header={"輸入房號"}>
            請輸入四位數字嘅房號。
            <TileTextbox value={code} onChange={e => setCode(e.target.value)}/>
            <IntrinsicButton disabled={code === ""} onClick={handleSubmit}>確定</IntrinsicButton>
        </TileDialogue>
    </Frag>;
}
