import React, {useContext, useEffect, useState} from "react";

import {GameContext} from "../GameProvider";
import Button from "../generic/Button";
import Dialog from "../generic/Dialog";
import {MsgboxMsg} from "@/components/global/MsgboxMsg";
import LoadingSpinner from "@/components/generic/LoadingSpinner";
import {ms} from "@/utils/AsyncUtils";

export default function MsgboxOverlay() {
    const ctx = useContext(GameContext);

    // const errorMsgs: { [key: string]: string } = {
    //     ERROR_ROOM_INVALID: "冇呢間房。請確保您打啱個房間編號。",
    //     ERROR_ROOM_FULL: "呢間房已經人滿。",
    //     ERROR_UNKNOWN: "發生咗個未知嘅問題。請隔一陣或者重新載入頁面後再試過。如果問題持續出現，請聯絡我哋。"
    // };

    const [curMsg, setCurMsg] = useState<MsgboxMsg | null>(null);
    const [shown, setShown] = useState(false);
    useEffect(() => {
        const func = async () => {
            const newMsg = ctx?.msg;
            if (shown) {
                setShown(false);
                await ms(200);
            }
            if (newMsg) {
                setCurMsg(newMsg);
                setShown(true);
            }
        };
        func().then();
    }, [ctx.msg]);

    return <Dialog shown={shown}
                   // icon={<MdError/>}
                   // title={"錯誤"}
                   bgDarkened
                   zIndex={100}>
        {/*<div className="px-2 bg-red-600 text-white">錯誤代碼：{ctx.errorCode}</div>*/}
        {
            curMsg?.progressing &&
            <div className={"flex gap-2"}>
                <LoadingSpinner/>
                載入中......
            </div>
        }
        {
            !curMsg?.progressing &&
            <>
                {curMsg?.content}
                <Button onClick={() => ctx?.setMsg(null)}>確定</Button>
            </>
        }
    </Dialog>;
}
