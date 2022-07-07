import React, {useState} from "react";
import classNames from "classnames";
import {IoAccessibility, IoChevronBackCircle, IoPersonAdd} from "react-icons/io5";
import ThreeSectionButton from "./generics/ThreeSectionButton";
import {GiFireball, GiShintoShrine, GiTempleGate} from "react-icons/gi";
import Header from "./generics/Header";
import HeaderButton from "./generics/HeaderButton";
import HeaderSection from "./generics/HeaderSection";

export default function DialogueRoom(
    props: {
        onBackClicked: () => void
    }
): React.ReactElement {
    const [mode, setMode] = useState(0);

    return <div className={"w-full flex-1 bg-gray-900 flex text-white"}>
        <div className={"h-full flex-1 flex flex-col"}>
            <Header>
                <HeaderSection>房間選項</HeaderSection>
                <HeaderButton active={true}>遊戲模式</HeaderButton>
                <HeaderButton>模式偏好設定</HeaderButton>
                <HeaderButton>其他</HeaderButton>
            </Header>
            <div className={"flex-1 overflow-y-scroll"}>
                <div className={"p-4 flex flex-col gap-4"}>
                    <div className={"text-xl"}>遊戲模式</div>
                    <div className={"w-full flex gap-4"}>
                        {
                            [
                                {
                                    name: "香港麻雀",
                                    desc: "三番起糊；食糊牌型較少；規則較簡單。",
                                    icon: <div>🥟</div>
                                },
                                {
                                    name: "台灣麻雀",
                                    desc: "每人十六隻牌；食糊牌型較多；規則較複雜。",
                                    icon: <div>🧋</div>
                                },
                                {
                                    name: "日本麻雀",
                                    desc: "加入立直、懸賞牌等元素；規則較複雜。",
                                    icon: <div>⛩</div>
                                },
                                {
                                    name: "日本三麻",
                                    desc: "三人一臺嘅日本麻雀。",
                                    icon: <div>⛩</div>
                                },
                                {
                                    name: "瑪灼血戰",
                                    desc: "每局開始前先調牌。",
                                    icon: <div>☄️</div>
                                },
                            ].map((o, i) =>
                                <ThreeSectionButton key={i}
                                                    icon={o.icon}
                                                    name={o.name}
                                                    desc={o.desc}
                                                    active={i === mode}
                                                    disabled={!(i === 0 || i === 2)}
                                                    onClick={() => setMode(i)}
                                                    className={"flex-1 h-[400px]"}/>)
                        }
                    </div>
                </div>
            </div>
        </div>
        <div className={"h-full w-[400px] flex flex-col"}>
            <Header><HeaderSection>玩家列表</HeaderSection></Header>
            <div className={"flex-1 flex flex-col gap-4 p-4"}>
                {
                    [
                        null, null, null, null,
                    ].map((o, i) =>
                        <div key={i}
                             className={"border rounded py-4 px-8 flex place-content-center place-items-center gap-4"}>
                            {
                                o ||
                                <><IoPersonAdd/>新增電腦玩家</>
                            }
                        </div>)
                }
            </div>
            <div className={"bg-gray-700 p-4 text-center border-t-4 border-white/10"}>
                <div className={""}>房間編號</div>
                <div className={"text-3xl"}>2647</div>
            </div>
        </div>
    </div>;
}
