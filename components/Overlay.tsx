import React from "react";
import {CSSTransition} from "react-transition-group";
import classNames from "classnames";

export default function Overlay(props: React.PropsWithChildren<{
    shown: boolean,
}>): React.ReactElement {

    return <CSSTransition classNames="fade"
                          in={props.shown}
                          timeout={100}
                          unmountOnExit>
        <div className={"absolute inset-0 flex place-content-center place-items-center bg-black/25"}>
            {props.children}
        </div>
    </CSSTransition>;
}
