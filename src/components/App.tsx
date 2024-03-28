import React, {useContext} from "react";
import PageSplash from "./pages/PageSplash";
import PageGame from "@/components/game/PageGame";
import PageType from "@/components/pages/PageType";
import {GameContext} from "@/components/GameProvider";
import MsgboxOverlay from "@/components/global/MsgboxOverlay";

export default function App(): React.ReactElement {
    const ctx = useContext(GameContext);

    return <div className="w-screen h-screen overflow-hidden">
        {ctx.page === PageType.SPLASH && <PageSplash/>}
        {/*{(ctx.page !== PageType.SPLASH && ctx.page !== PageType.GAME) && <PageMenus/>}*/}
        {ctx.page === PageType.GAME && <PageGame/>}
        {/*<FragLoginOld/>*/}
        <MsgboxOverlay/>
        {/*<ServerStatus/>*/}
    </div>;
}
