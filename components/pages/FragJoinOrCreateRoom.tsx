import React, {useEffect, useState} from "react";
import {IoAddCircle, IoChevronBackCircle, IoEnter, IoPersonAdd} from "react-icons/io5";
import ThreeSectionButton from "../generics/ThreeSectionButton";
import {CSSTransition} from "react-transition-group";
import Header from "../pieces/Header";
import HeaderButton from "../generics/HeaderButton";
import HeaderSection from "../generics/HeaderSection";
import FadeIn from "../transitions/FadeIn";
import {ms} from "../../utils/Delay";

export default function FragJoinOrCreateRoom(props: {
    in: boolean,
    setPage: (page: number) => void
}): React.ReactElement {

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
        <div className={"absolute inset-0 z-20 w-full h-screen bg-gray-900 flex flex-col overflow-hidden"}>
            <div className={"w-full flex-1 flex place-items-center place-content-center gap-4"}>
                <ThreeSectionButton icon={<IoAddCircle/>}
                                    name={"創建房間"}
                                    desc={"創建一間新嘅房間以邀請朋友加入"}
                                    onClick={() => props.setPage(2)}
                                    className={"w-[300px] h-[300px]"}/>
                <ThreeSectionButton icon={<IoEnter/>}
                                    name={"加入房間"}
                                    desc={"如果朋友已經開咗一間房，您可以輸入房號加入房間"}
                                    onClick={() => props.setPage(3)}
                                    className={"w-[300px] h-[300px]"}/>
            </div>
            <CSSTransition classNames="slideup" in={contentShown} timeout={200} unmountOnExit>
                <Header>
                    <HeaderButton onClick={() => props.setPage(0)}><IoChevronBackCircle/>返回</HeaderButton>
                    <HeaderSection>私人牌局</HeaderSection>
                </Header>
            </CSSTransition>
        </div>
    </FadeIn>;
}
