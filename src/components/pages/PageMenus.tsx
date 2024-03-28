import React, {useContext} from "react";

import FragHome from "./FragHome";
import FragJoinRoom from "./FragJoinRoom";
import FragRoom from "./FragRoom";
import {GameContext} from "../GameProvider";
import PageType from "./PageType";

export default function PageMenus(): React.ReactElement {
    const ctx = useContext(GameContext);

    return <div className="absolute inset-0 z-20 w-full h-full overflow-hidden">
        <FragHome in={ctx.page === PageType.TITLE}/>
        <FragJoinRoom in={ctx.page === PageType.JOIN_ROOM}/>
        <FragRoom in={ctx.page === PageType.ROOM}/>
    </div>;
}
