import FadeIn from "../transitions/FadeIn";
import React, {useEffect, useState} from "react";
import Header from "../pieces/Header";
import HeaderSection from "../generics/HeaderSection";
import HeaderButton from "../generics/HeaderButton";
import {IoChevronBackCircle} from "react-icons/io5";
import classNames from "classnames";
import {ms} from "../../utils/Delay";
import {CSSTransition} from "react-transition-group";

export default function Frag(props: React.PropsWithChildren<{
    className?: string,
    header: string | React.ReactElement,
    in: boolean
    onBack: () => void
}>) {
    const [overlayShown, setOverlayShown] = useState(false);
    const [contentShown, setContentShown] = useState(false);
    useEffect(() => {
        (async () => {
            if (props.in) {
                setOverlayShown(true);
                await ms(1);
                setContentShown(true);
            } else {
                setContentShown(false);
                await ms(1);
                setOverlayShown(false);
            }
        })();
    }, [props.in]);

    return <FadeIn in={overlayShown}>
        <div className={"w-full h-full flex flex-col text-white bg-gray-800"}>
            <div className={classNames("w-full flex-1 flex", props.className)}>
                {props.children}
            </div>
            <CSSTransition classNames="slideup" in={contentShown} timeout={200} unmountOnExit>
                <Header>
                    <HeaderButton onClick={props.onBack}><IoChevronBackCircle/>返回</HeaderButton>
                    {
                        typeof props.header === "string" ?
                            <HeaderSection>{props.header}</HeaderSection> :
                            props.header
                    }
                </Header>
            </CSSTransition>
        </div>
    </FadeIn>;
}
