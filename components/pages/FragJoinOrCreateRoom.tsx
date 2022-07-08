import React, {useState} from "react";
import classNames from "classnames";
import {IoAccessibility, IoAddCircle, IoChevronBackCircle, IoEnter, IoPersonAdd} from "react-icons/io5";
import ThreeSectionButton from "../generics/ThreeSectionButton";
import {GiEarthAsiaOceania, GiFireball, GiMushroomHouse, GiPodium, GiShintoShrine, GiTempleGate} from "react-icons/gi";
import Header from "../pieces/Header";
import HeaderButton from "../generics/HeaderButton";
import HeaderSection from "../generics/HeaderSection";

export default function FragJoinOrCreateRoom(props: {
    setPage: (page: number) => void
}): React.ReactElement {
    const [mode, setMode] = useState(0);

    return <div className={"w-full flex-1 flex place-items-center place-content-center gap-4"}>
        <ThreeSectionButton icon={<IoAddCircle/>}
                            name={"創建房間"}
                            desc={"創建一間新嘅房間以邀請朋友加入"}
                            onClick={() => props.setPage(2)}
                            className={"w-[300px] h-[300px]"}/>
        <ThreeSectionButton icon={<IoEnter/>}
                            name={"加入房間"}
                            desc={"如果朋友已經開咗一間房，您可以輸入房號加入房間"}
                            onClick={() => props.setPage(3)}
                            className={"w-[300px] h-[300px]"}/>
    </div>;
}
