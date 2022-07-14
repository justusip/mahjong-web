import React, {useEffect, useState} from "react";
import {ms} from "../../utils/Delay";
import {CSSTransition} from "react-transition-group";

export default function ServerStatus(props: { connected: boolean }) {
    const [shown, setShown] = useState(false);
    useEffect(() => {
        (async () => {
            setShown(true);
            await ms(2000);
            setShown(false);
        })();
    }, [props.connected]);
    return <CSSTransition classNames="magnify" in={shown} timeout={100} unmountOnExit>
        <div className={"absolute z-40 bottom-4 right-4 p-4 bg-black text-white"}>
            {
                props.connected ? "已經連接遊戲伺服器" : "已經失去同遊戲伺服器嘅連線"
            }
        </div>
    </CSSTransition>;
}
