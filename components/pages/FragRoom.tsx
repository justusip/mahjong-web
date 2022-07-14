import React, {useState} from "react";
import {
    IoCheckbox,
    IoCheckmarkCircle, IoCloseCircle,
    IoCopy,
    IoPersonAdd,
    IoPersonRemove,
    IoPlayCircle,
    IoStopOutline
} from "react-icons/io5";
import ThreeSectionButton from "../generics/ThreeSectionButton";
import Header from "../pieces/Header";
import HeaderButton from "../generics/HeaderButton";
import HeaderSection from "../generics/HeaderSection";
import Frag from "./Frag";
import copy from "copy-to-clipboard";
import RoomStatus from "../../types/RoomStatus";
import IntrinsicButton from "../generics/IntrinsicButton";

export default function FragRoom(props: {
    in: boolean,
    onBack: () => void,
    onBotAdd: () => void,
    onPlayerKick: (playerIdx: number) => void,
    roomStatus: RoomStatus | null,
    onSetReady: (ready: boolean) => void,
    onGameStart: () => void
}): React.ReactElement {
    const [mode, setMode] = useState(0);

    if (!props.roomStatus) //TODO
        return <div></div>;

    const canStart = props.roomStatus.players.length !== 4 || !props.roomStatus.players.every(p => p.ready);
    const iAmOwner = props.roomStatus.iAm === 0;
    const iAmReady = props.roomStatus.players[props.roomStatus.iAm].ready;
    console.log(props.roomStatus);
    return <Frag in={props.in}
                 header={<>
                     <div
                         className={"bg-gray-700 border-x border-b-4 border-gray-800 flex-1 flex place-content-center p-2"}>
                         <div
                             className={"flex rounded border border-gray-400 px-8 py-2 place-items-center text-xl gap-4 cursor-pointer hover:bg-white/20 active:bg-white/10 transition-all"}
                             onClick={() => copy(props.roomStatus.code)}>
                             <div className={"text-sm flex place-items-center gap-1"}>房間編號</div>
                             <div>{props.roomStatus.code}</div>
                             <div className={"text-sm flex place-items-center gap-1"}><IoCopy/>點擊複製</div>
                         </div>
                     </div>
                     {
                         iAmOwner ?
                             <HeaderButton onClick={() => props.onGameStart()}
                                           disabled={canStart}><IoPlayCircle/>開始遊戲</HeaderButton> :
                             <HeaderButton onClick={() => props.onSetReady(!iAmReady)}>
                                 {iAmReady ? <><IoCloseCircle/>取消準備</> : <><IoCheckmarkCircle/>準備好</>}
                             </HeaderButton>
                     }
                 </>}
                 onBack={props.onBack}>
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
                                    icon: <img src={"/img/icons/dumpling_1f95f.png"}/>
                                },
                                {
                                    name: "台灣麻雀",
                                    desc: "每人十六隻牌；食糊牌型較多；規則較複雜。",
                                    icon: <img src={"/img/icons/bubble-tea_1f9cb.png"}/>
                                },
                                {
                                    name: "日本麻雀",
                                    desc: "加入立直、懸賞牌等元素；規則較複雜。",
                                    icon: <img src={"/img/icons/shinto-shrine_26e9-fe0f.png"}/>
                                },
                                {
                                    name: "日本三麻",
                                    desc: "三人一臺嘅日本麻雀。",
                                    icon: <img src={"/img/icons/shinto-shrine_26e9-fe0f.png"}/>
                                },
                                {
                                    name: "瑪灼血戰",
                                    desc: "每局開始前先調牌。",
                                    icon: <img src={"/img/icons/comet_2604-fe0f.png"}/>
                                },
                            ].map((o, i) =>
                                <ThreeSectionButton key={i}
                                                    icon={o.icon}
                                                    name={o.name}
                                                    desc={o.desc}
                                                    active={i === mode}
                                                    disabled={!(i === 0)}
                                                    onClick={() => setMode(i)}
                                                    className={"flex-1 h-[400px]"}/>)
                        }
                    </div>
                </div>
            </div>
        </div>
        <div className={"h-full w-[400px] flex flex-col"}>
            <Header><HeaderSection>玩家列表</HeaderSection></Header>
            <div className={"flex-1 flex flex-col gap-4 p-4 pr-0"}>
                {
                    [...new Array(4)].map((_, i) => {
                        const player = props.roomStatus.players[i];
                        if (!player) {
                            return <IntrinsicButton key={i} className={"place-items-center"}
                                                    onClick={props.onBotAdd}
                                                    disabled={!iAmOwner}>
                                <div className={"flex place-items-center gap-2"}><IoPersonAdd/>新增電腦玩家</div>
                            </IntrinsicButton>;
                        }
                        return <div key={i} className={"p-2 flex place-items-center bg-gray-700"}>
                            <div className={"flex-1 flex flex-col"}>
                                <div className={"text-xl"}>{props.roomStatus.players[i].name}</div>
                                <div className={"flex text-xs place-items-center gap-1"}>
                                    {i === 0 ? "房主" : (player.ready ? <><IoCheckbox/>準備好</> : <><IoStopOutline/>未準備</>)}
                                </div>
                            </div>
                            {i !== 0 &&
                                <IntrinsicButton onClick={() => props.onPlayerKick(i)}
                                                 disabled={!iAmOwner}>
                                    <IoPersonRemove className={"m-2"}/>
                                </IntrinsicButton>
                            }
                        </div>;
                    })
                }
            </div>
        </div>
    </Frag>;
}
