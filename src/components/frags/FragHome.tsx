import classNames from "classnames";
import React, {useContext} from "react";
import {GiEarthAsiaOceania, GiMushroomHouse, GiPodium} from "react-icons/gi";
import {IoLogIn} from "react-icons/io5";

import {GameContext} from "../GameProvider";
import HeaderButton from "../generics/HeaderButton";
import HeaderSection from "../generics/HeaderSection";
import Page from "../Page";
import Header from "../pieces/Header";
import FadeIn from "../transitions/FadeIn";

export default function FragHome(props: {
    in: boolean,
    requestLogin: () => void
}): React.ReactElement {
    const ctx = useContext(GameContext);

    return <FadeIn in={props.in}>
        <div className="w-full h-full flex flex-col">
            <div className="w-full flex-1 flex">
                <div className="w-3/5 flex-1 p-16 flex place-content-center place-items-stretch gap-8">
                    {
                        [
                            {
                                icon: <GiPodium/>,
                                name: "瑪灼聯盟",
                                desc: "同世界各地嘅麻雀玩家展開熱火朝天嘅對決",
                                colour: "bg-amber-700 border-amber-900 text-amber-200 hover:bg-amber-600 active:bg-amber-700",
                                onClick: props.requestLogin
                            },
                            {
                                icon: <GiEarthAsiaOceania/>,
                                name: "公眾牌局",
                                desc: "同唔同玩家打牌切磋，賽果唔會影響排名",
                                colour: "bg-emerald-700 border-emerald-900 text-emerald-200 hover:bg-emerald-600 active:bg-emerald-700",
                                onClick: props.requestLogin
                            },
                            {
                                icon: <GiMushroomHouse/>,
                                name: "私人牌局",
                                desc: "創建或加入私人房間，同朋友展開對決",
                                colour: "bg-cyan-700 border-cyan-900 text-cyan-200 hover:bg-cyan-600 active:bg-cyan-700",
                                onClick: () => ctx.setPage(Page.JOIN_OR_CREATE_ROOM)
                            }
                        ].map((o, i) =>
                            <div key={i}
                                 className={classNames(
                                     "p-8 flex flex-col place-items-center place-content-center",
                                     "gap-8 flex-1 text-center cursor-pointer transition-colors",
                                     "border-b-4 active:mt-[4px] active:border-b-0",
                                     o.colour
                                 )}
                                 onClick={o.onClick}>
                                <div className="text-6xl">{o.icon}</div>
                                <div className="text-2xl">{o.name}</div>
                                <div className="">{o.desc}</div>
                            </div>
                        )
                    }
                </div>
                <div className="w-2/5">
                </div>
            </div>
            <Header>
                <HeaderSection>Chronica™</HeaderSection>
                <HeaderButton onClick={props.requestLogin}><IoLogIn/>登入</HeaderButton>
            </Header>
        </div>
    </FadeIn>;
}
