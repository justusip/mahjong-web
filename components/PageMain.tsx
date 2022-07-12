import React, {useEffect, useState} from "react";
import TileButton from "./generics/TileButton";
import Post from "../utils/PostFetch";
import TileDialogue from "./generics/TileDialogue";
import TileTextbox from "./generics/TileTextbox";
import Overlay from "./pieces/Overlay";
import {useSharedState} from "./Store";
import classNames from "classnames";
import {IoChevronBackCircle, IoLogIn, IoSettings,} from "react-icons/io5";
import {CSSTransition} from "react-transition-group";
import FragRoom from "./pages/FragRoom";
import {ms} from "../utils/Delay";
import HeaderButton from "./generics/HeaderButton";
import Header from "./pieces/Header";
import HeaderSection from "./generics/HeaderSection";
import FragHome from "./pages/FragHome";
import FragJoinOrCreateRoom from "./pages/FragJoinOrCreateRoom";
import FadeIn from "./transitions/FadeIn";
import FragJoinRoom from "./pages/FragJoinRoom";
import OverlayDialogue from "./pieces/OverlayDialogue";
import UserInfo from "../network/UserInfo";
import {GiEarthAsiaOceania, GiMushroomHouse, GiPodium} from "react-icons/gi";

export default function PageMain(props: {
    me: UserInfo | null,
    requestLogin: () => void,
    onLogout: () => void
}): React.ReactElement {

    // useEffect(() => {
    //     (async () => {
    //         const res = await Post("/api/friends", {});
    //         if (res.ok) {
    //             const js = await res.json();
    //             if (js.ok)
    //                 setFriends(js);
    //         }
    //     })();
    // }, []);

    const [page, setPageRaw] = useState(0);

    const [globals, setGlobals] = useSharedState();

    const setPage = async (toPage: number) => {
        setPageRaw(-1);
        await ms(400);
        setPageRaw(toPage);
    };

    return <div className={classNames(
        "w-full h-screen ",
        "bg-[url(/img/bg.jpg)]a bg-gray-900 bg-cover bg-center",
        "flex flex-col overflow-hidden"
    )}>
        <div className={"w-full flex-1 flex"}>
            <div className={"w-3/5 flex-1 p-16 flex place-content-center place-items-stretch gap-4"}>
                {
                    [
                        {
                            icon: <GiPodium/>,
                            name: "瑪灼聯盟",
                            desc: "同世界各地嘅麻雀玩家展開熱火朝天嘅對決",
                            colour: "bg-amber-700 border-amber-900 text-amber-200 hover:bg-amber-600 active:bg-amber-700"
                        },
                        {
                            icon: <GiEarthAsiaOceania/>,
                            name: "公眾牌局",
                            desc: "同唔同玩家打牌切磋，賽果唔會影響排名",
                            colour: "bg-emerald-700 border-emerald-900 text-emerald-200 hover:bg-emerald-600 active:bg-emerald-700"
                        },
                        {
                            icon: <GiMushroomHouse/>,
                            name: "私人牌局",
                            desc: "創建或加入私人房間，同朋友展開對決",
                            colour: "bg-cyan-700 border-cyan-900 text-cyan-200 hover:bg-cyan-600 active:bg-cyan-700"
                        }
                    ].map((o, i) =>
                        <div key={i}
                             className={classNames(
                                 "p-8 flex flex-col place-items-center place-content-center",
                                 "gap-8 flex-1 text-center cursor-pointer transition-colors",
                                 "border-b-4 active:mt-[4px] active:border-b-0",
                                 o.colour
                             )}
                             onClick={() => setPageRaw(1)}>
                            <div className={"text-6xl"}>{o.icon}</div>
                            <div className={"text-2xl"}>{o.name}</div>
                            <div className={""}>{o.desc}</div>
                        </div>
                    )
                }
            </div>
            <div className={"w-2/5"}>
            </div>
        </div>
        <Header>
            <HeaderSection>Chronica™</HeaderSection>
            <HeaderButton onClick={() => props.requestLogin()}><IoLogIn/>登入</HeaderButton>
        </Header>

        <FragJoinOrCreateRoom in={page === 1} setPage={setPageRaw}/>
        <FadeIn in={page == 2}><FragRoom onBackClicked={() => setPage(1)}/></FadeIn>
        <FadeIn in={page == 3}><FragJoinRoom onBackClicked={() => setPage(1)}/></FadeIn>

    </div>;
};
