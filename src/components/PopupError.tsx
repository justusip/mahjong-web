import React, {useContext, useEffect, useState} from "react";

import {GameContext} from "./GameProvider";
import TileButton from "./generics/TileButton";
import OverlayDialogue from "./pieces/OverlayDialogue";

export default function PopupLoading() {
    const ctx = useContext(GameContext);

    const errorMsgs: { [key: string]: string } = {
        ERROR_ROOM_INVALID: "冇呢間房。請確保您打啱個房間編號。",
        ERROR_ROOM_FULL: "呢間房已經人滿。",
        ERROR_UNKNOWN: "發生咗個未知嘅問題。請隔一陣或者重新載入頁面後再試過。如果問題持續出現，請聯絡我哋。"
    };
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        if (ctx.errorCode) {
            if (!Object.keys(errorMsgs).includes(ctx.errorCode)) {
                setErrorMsg("發生咗個未知嘅問題。請隔一陣或者重新載入頁面後再試過。如果問題持續出現，請聯絡我哋。");
            } else {
                setErrorMsg(errorMsgs[ctx.errorCode]);
            }
        }
    }, [ctx.errorCode]);

    return <OverlayDialogue shown={ctx.errorShown} centered={true} header="錯誤">
        <div className="px-2 bg-red-600 text-white">錯誤代碼：{ctx.errorCode}</div>
        {errorMsg}
        <TileButton onClick={() => ctx.setErrorShown(false)}>確定</TileButton>
    </OverlayDialogue>;
}
