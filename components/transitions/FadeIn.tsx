import React, {useState} from "react";
import {CSSTransition} from "react-transition-group";

export default function FadeIn(props: React.PropsWithChildren<{
    in: boolean
}>): React.ReactElement {
    return <CSSTransition classNames="fade" in={props.in} timeout={100} unmountOnExit>{props.children}</CSSTransition>;
}
