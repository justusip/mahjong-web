import React, {useContext, useEffect, useState} from "react";
import {IoCheckmarkCircle, IoCloseCircle} from "react-icons/io5";
import {CSSTransition} from "react-transition-group";

import {GameContext} from "../GameProvider";
import {ms} from "../../utils/Delay";

export default function ServerStatus() {
    const ctx = useContext(GameContext);
    const [shown, setShown] = useState(false);

    useEffect(() => {
        (async () => {
            setShown(true);
            await ms(2000);
            setShown(false);
        })();
    }, [ctx.isConnected]);
    return <CSSTransition classNames="magnify" in={shown} timeout={100} unmountOnExit>
        <div className="absolute z-40 bottom-4 right-4 p-4 bg-black text-white flex place-items-center gap-2">
            {
                ctx.isConnected ? <><IoCheckmarkCircle/>已經連接遊戲伺服器</> : <><IoCloseCircle/>已經失去同遊戲伺服器嘅連線</>
            }
        </div>
    </CSSTransition>;
}
