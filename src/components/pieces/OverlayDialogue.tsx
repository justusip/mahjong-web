import classNames from "classnames";
import React, {useEffect, useState} from "react";
import {CSSTransition} from "react-transition-group";

import TileDialogue from "../generics/TileDialogue";
import {ms} from "../../utils/Delay";

export default function OverlayDialogue(props: React.PropsWithChildren<{
    shown: boolean,
    transition?: string
    onClick?: () => void,
    centered?: boolean
} & {
    className?: string,
    header?: string,
}>): React.ReactElement {

    const [overlayShown, setOverlayShown] = useState(false);
    const [contentShown, setContentShown] = useState(false);
    useEffect(() => {
        (async () => {
            if (props.shown) {
                setOverlayShown(true);
                await ms(1);
                setContentShown(true);
            } else {
                setContentShown(false);
                await ms(1);
                setOverlayShown(false);
            }
        })();
    }, [props.shown]);

    return <CSSTransition classNames="fade"
                          in={overlayShown}
                          timeout={100}
                          unmountOnExit>
        <div className={classNames(
            "absolute z-40 inset-0 bg-black/50",
            {"flex place-items-center place-content-center": props.centered}
        )}
             onClick={props.onClick}>
            <TileDialogue in={contentShown}
                          className={props.className}
                          header={props.header}>
                {props.children}
            </TileDialogue>
        </div>
    </CSSTransition>;
}
