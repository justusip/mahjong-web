import React, {useState} from "react";
import {CSSTransition} from "react-transition-group";

export default function Magnify(props: React.PropsWithChildren<{
    in: boolean
}>): React.ReactElement {
    return <CSSTransition classNames="magnify" in={props.in} timeout={100} unmountOnExit>{props.children}</CSSTransition>;
}
