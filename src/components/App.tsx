import React, {useContext} from "react";

import SceneGame from "./game/SceneGame";
import {GameContext} from "./GameProvider";
import PageMenus from "./menu/PageMenus";
import PageSplash from "./menu/PageSplash";
import OverlayLogin from "./overlays/OverlayLogin";
import ServerStatus from "./overlays/ServerStatus";
import Page from "./Page";
import PopupError from "./PopupError";
import PopupLoading from "./PopupLoading";

export default function App(): React.ReactElement {
    const ctx = useContext(GameContext);

    return <div className="w-screen h-screen overflow-hidden bg-gray-800">
        {ctx.page === Page.SPLASH && <PageSplash/>}
        {(ctx.page !== Page.SPLASH && ctx.page !== Page.GAME) && <PageMenus/>}
        {ctx.page === Page.GAME && <SceneGame/>}
        <OverlayLogin/>
        <PopupError/>
        <PopupLoading/>
        <ServerStatus/>
    </div>;
}
