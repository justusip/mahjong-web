import React, {useState} from "react";
import classNames from "classnames";
import {IoAccessibility, IoChevronBackCircle, IoPersonAdd} from "react-icons/io5";
import ThreeSectionButton from "../generics/ThreeSectionButton";
import {GiFireball, GiShintoShrine, GiTempleGate} from "react-icons/gi";
import Header from "../pieces/Header";
import HeaderButton from "../generics/HeaderButton";
import HeaderSection from "../generics/HeaderSection";
import TileDialogue from "../generics/TileDialogue";
import TileTextbox from "../generics/TileTextbox";
import TileButton from "../generics/TileButton";
import IntrinsicButton from "../generics/IntrinsicButton";
import Magnify from "../transitions/Magnify";
import {ms} from "../../utils/Delay";

export default function FragJoinRoom(props: {
    onBackClicked: () => void
}): React.ReactElement {

    const [code, setCode] = useState("");
    const [page, setPage] = useState(0);
    const toPage = async (page: number) => {
        setPage(-1);
        await ms(100);
        setPage(page);
    };

    const handleSubmit = async () => {
        await toPage(1);
        await ms(1000);
        await toPage(2);
    };

    return <div className={"w-full flex-1 flex place-items-center place-content-center"}>
        <TileDialogue in={page === 0} header={"輸入房號"}>
            請輸入四位數字嘅房號。
            <TileTextbox value={code} onChange={e => setCode(e.target.value)}/>
            <IntrinsicButton disabled={code === ""} onClick={handleSubmit}>確定</IntrinsicButton>
        </TileDialogue>
        <TileDialogue in={page === 1}>
            請稍候...
        </TileDialogue>
        <TileDialogue in={page === 2} header={"錯誤"}>
            未能進入房間。請稍後重試。
            <IntrinsicButton onClick={() => toPage(0)}>確定</IntrinsicButton>
        </TileDialogue>
    </div>;
}
