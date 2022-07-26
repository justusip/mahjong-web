import React, {useContext} from "react";

import {GameContext} from "./GameProvider";
import OverlayDialogue from "./pieces/OverlayDialogue";

export default function PopupLoading() {
    const ctx = useContext(GameContext);

    return <OverlayDialogue shown={ctx.isProgressing} centered={true}>
        <div className="flex gap-2 place-items-center">
            <div className="animate-spin">.</div>
            載入中
        </div>
    </OverlayDialogue>;
}
