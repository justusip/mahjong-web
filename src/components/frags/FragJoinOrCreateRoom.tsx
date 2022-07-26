import React, {useContext} from "react";
import {IoAddCircle, IoEnter} from "react-icons/io5";

import Frag from "./Frag";
import {GameContext} from "../GameProvider";
import ThreeSectionButton from "../generics/ThreeSectionButton";
import Page from "../Page";
import {Messages} from "../../network/Messages";

export default function FragJoinOrCreateRoom(props: {
    in: boolean
}): React.ReactElement {
    const ctx = useContext(GameContext);

    return <Frag in={props.in} header="加入房間" onBack={() => ctx.setPage(Page.TITLE)}
                 className="place-items-center place-content-center gap-4">
        <ThreeSectionButton icon={<IoAddCircle/>}
                            name="創建房間"
                            desc="創建一間新嘅私人房間以邀請朋友加入"
                            onClick={() => ctx.socketRequest(Messages.ROOM_CREATE)}
                            className="w-[300px] h-[300px]"/>
        <ThreeSectionButton icon={<IoEnter/>}
                            name="加入房間"
                            desc="如果朋友已經開咗一間房，您可以輸入房號加入房間"
                            onClick={() => ctx.setPage(Page.JOIN_ROOM)}
                            className="w-[300px] h-[300px]"/>
    </Frag>;
}
