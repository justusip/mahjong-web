import {IoChatboxEllipses, IoHelpCircle, IoPeople, IoSettings} from "react-icons/io5";
import classNames from "classnames";
import React from "react";
import Header from "./generics/Header";
import HeaderSection from "./generics/HeaderSection";
import HeaderButton from "./generics/HeaderButton";

export default function Footer(
    props: {
        onClicks: (() => void)[]
    }
): React.ReactElement {
    return <Header>
        <HeaderSection>Chronica™</HeaderSection>
        {
            [
                {
                    icon: <IoSettings/>,
                    name: "設定"
                },
                {
                    icon: <IoPeople/>,
                    name: "朋友",
                    onClick: () => props.onClicks[1]()
                },
                {
                    icon: <IoChatboxEllipses/>,
                    name: "意見回饋"
                },
                {
                    icon: <IoHelpCircle/>,
                    name: "關於"
                }
            ].map((o, i) => <HeaderButton onClick={o.onClick}>{o.icon}{o.name}</HeaderButton>)
        }
    </Header>;
}
