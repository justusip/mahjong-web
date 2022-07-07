import React, {MouseEventHandler} from "react";
import TileTextbox from "./TileTextbox";
import TileButton from "./TileButton";
import Milliseconds from "../utils/Milliseconds";
import {CSSTransition} from "react-transition-group";
import classNames from "classnames";

export default function TileDialogue(props: React.PropsWithChildren<{
    className?: string,
    shown: boolean,
    header?: React.ReactElement,
}>): React.ReactElement {
    return <CSSTransition classNames="magnify"
                          in={props.shown}
                          timeout={100}
                          unmountOnExit>
        <div className={classNames("bg-white rounded absolute shadow m-8", props.className)}>
            {props.header &&
                <div className="p-4">
                    {props.header}
                </div>
            }
            <div className={"p-4 border-t-2"}>
                {props.children}
            </div>
        </div>
    </CSSTransition>;
}
