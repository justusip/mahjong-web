import React, {useContext, useEffect, useState} from "react";

import SceneLobby from "./SceneLobby";
import FragHome from "../frags/FragHome";
import FragJoinOrCreateRoom from "../frags/FragJoinOrCreateRoom";
import FragJoinRoom from "../frags/FragJoinRoom";
import FragRoom from "../frags/FragRoom";
import {GameContext} from "../GameProvider";
import Page from "../Page";
import {ms} from "../../utils/Delay";

export default function PageMenus(): React.ReactElement {
    const ctx = useContext(GameContext);

    const [innerPage, setInnerPage] = useState(-1);
    useEffect(() => {
        (async () => {
            if (ctx.page === innerPage)
                return;
            setInnerPage(-1);
            await ms(400);
            setInnerPage(ctx.page);
        })();
    }, [ctx.page, innerPage]);

    return <>
        <div className="absolute inset-0 z-20 w-full h-full overflow-hidden">
            <FragHome in={innerPage === Page.TITLE} requestLogin={() => {
            }}/>
            <FragJoinOrCreateRoom in={innerPage === Page.JOIN_OR_CREATE_ROOM}/>
            <FragJoinRoom in={innerPage === Page.JOIN_ROOM}/>
            <FragRoom in={innerPage === Page.ROOM}/>
        </div>
        <SceneLobby/>
    </>;
}
