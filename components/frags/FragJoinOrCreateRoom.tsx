import React from "react";
import {IoAddCircle, IoEnter} from "react-icons/io5";
import ThreeSectionButton from "../generics/ThreeSectionButton";
import Frag from "./Frag";

export default function FragJoinOrCreateRoom(props: {
    in: boolean,
    onBack: () => void
    onCreateRoom: () => void,
    onEnterRoom: () => void
}): React.ReactElement {

    return <Frag in={props.in} header={"加入房間"} onBack={props.onBack}
                 className={"place-items-center place-content-center gap-4"}>
        <ThreeSectionButton icon={<IoAddCircle/>}
                            name={"創建房間"}
                            desc={"創建一間新嘅私人房間以邀請朋友加入"}
                            onClick={props.onCreateRoom}
                            className={"w-[300px] h-[300px]"}/>
        <ThreeSectionButton icon={<IoEnter/>}
                            name={"加入房間"}
                            desc={"如果朋友已經開咗一間房，您可以輸入房號加入房間"}
                            onClick={props.onEnterRoom}
                            className={"w-[300px] h-[300px]"}/>
    </Frag>;
}
