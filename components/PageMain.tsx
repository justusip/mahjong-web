import React, {useEffect, useState} from "react";
import TileButton from "./generics/TileButton";
import Post from "../utils/PostFetch";
import Milliseconds from "../utils/Milliseconds";
import TileDialogue from "./TileDialogue";
import TileTextbox from "./generics/TileTextbox";
import Overlay from "./Overlay";
import {useSharedState} from "./Store";
import {GiEarthAsiaOceania, GiMushroomHouse, GiPodium} from "react-icons/gi";
import classNames from "classnames";
import {
    IoAddCircle, IoChevronBackCircle,
    IoEnter, IoPersonAdd,
} from "react-icons/io5";
import Footer from "./Footer";
import ThreeSectionButton from "./generics/ThreeSectionButton";
import {CSSTransition} from "react-transition-group";
import IntrinsicButton from "./generics/IntrinsicButton";
import DialogueRoom from "./DialogueRoom";
import {ms} from "../misc/Delay";
import HeaderButton from "./generics/HeaderButton";
import Header from "./generics/Header";
import HeaderSection from "./generics/HeaderSection";

export default function PageMain(): React.ReactElement {

    useEffect(() => {
        (async () => {
            const res = await Post("/api/friends", {});
            if (res.ok) {
                const js = await res.json();
                if (js.ok)
                    setFriends(js);
            }
        })();
    }, []);


    const [friends, setFriends] = useState<{ username: string, online: boolean }[]>([]);
    const [frdLstShown, setFrdLstShown] = useState(false);

    const [frdsAddShown, setFrdsAddShown] = useState(false);
    const [frdsAddUID, setFrdsAddUID] = useState("");

    const [page, setPageRaw] = useState(0);

    const [globals, setGlobals] = useSharedState();

    const setPage = async (toPage: number) => {
        setPageRaw(-1);
        await ms(400);
        setPageRaw(toPage);
    };

    return <div className={classNames(
        "w-full h-screen ",
        "bg-[url(/img/bg.jpg)] bg-gray-900 bg-cover bg-center",
        "flex flex-col flex-col-reverse overflow-hidden"
    )}>
        <CSSTransition classNames="slideup" in={page == 0} timeout={200} unmountOnExit>
            <Footer onClicks={[null, () => setFrdLstShown(true), null, null]}/>
        </CSSTransition>
        <CSSTransition classNames="slideup" in={page == 1 || page == 2} timeout={200} unmountOnExit>
            <Header>
                <HeaderButton onClick={() => setPage(0)}><IoChevronBackCircle/>返回</HeaderButton>
                <HeaderSection>私人牌局</HeaderSection>
            </Header>
        </CSSTransition>

        <CSSTransition classNames="fade" in={page == 0} timeout={100} unmountOnExit>
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
                                 onClick={() => setPage(1)}>
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
        </CSSTransition>

        <CSSTransition classNames="fade" in={page == 1} timeout={100} unmountOnExit>
            <div className={"w-full flex-1 flex place-items-center place-content-center gap-4"}>
                <ThreeSectionButton icon={<IoAddCircle/>}
                                    name={"創建房間"}
                                    desc={"創建一間新嘅房間以邀請朋友加入"}
                                    onClick={() => setPage(2)}
                                    className={"w-[300px] h-[300px]"}/>
                <ThreeSectionButton icon={<IoEnter/>}
                                    name={"加入房間"}
                                    desc={"如果朋友已經開咗一間房，您可以輸入房號加入房間"}
                                    className={"w-[300px] h-[300px]"}/>
            </div>
        </CSSTransition>

        <CSSTransition classNames="fade" in={page == 2} timeout={100} unmountOnExit>
            <DialogueRoom onBackClicked={() => setPage(1)}/>
        </CSSTransition>
        <CSSTransition classNames="magnify" in={page == 3} timeout={100} unmountOnExit>
            <div className={"absolute w-full h-full flex flex-col"}>
                <div className={"flex-1 flex place-items-center place-content-center gap-4"}>
                    <ThreeSectionButton icon={<IoAddCircle/>}
                                        name={"創建房間"}
                                        desc={"創建一間新嘅房間以邀請朋友加入"}/>
                    <ThreeSectionButton icon={<IoEnter/>}
                                        name={"加入房間"}
                                        desc={"如果朋友已經開咗一間房，您可以輸入房號加入房間"}/>
                </div>
            </div>
        </CSSTransition>
        <Overlay shown={frdLstShown}
                 transition={"slideleft"}
                 onClick={() => setFrdLstShown(false)}
                 centered={false}>
            <div className={"h-screen w-[400px] bg-gray-800 text-white p-4 flex flex-col gap-4 shadow-xl"}
                 onClick={e => e.stopPropagation()}>
                <div className={"text-xl"}>朋友清單</div>
                <div className={"p-2 border"}
                     onClick={async () => {
                         setFrdsAddShown(true);
                         await Milliseconds(1);
                         setFrdsAddShown(true);
                     }}>
                    新增朋友...
                </div>
                {
                    friends.length === 0 ?
                        <div className={"flex-1 flex place-content-center place-items-center"}>你未有加入任何朋友。</div> :
                        friends.map((friend, i) => <div key={i}>{friend}</div>)
                }
            </div>
        </Overlay>
        <Overlay shown={frdsAddShown}
                 transition={"magnify"}>
            <TileDialogue className={"w-full max-w-lg"}
                          header={<div className="text-2xl font-bold">新增朋友</div>}>
                <div className="text-gray-500">請喺下面輸入一個Username或UID。</div>
                <TileTextbox className="mt-2"
                             placeholder="Username/UID"
                             maxLength={16}
                             value={frdsAddUID}
                             onChange={e => setFrdsAddUID(e.target.value)}/>
                <div className={"flex gap-4 mt-4"}>
                    <TileButton className="flex-1"
                                type={"negative"}
                                onClick={() => setFrdsAddShown(false)}>
                        取消
                    </TileButton>
                    <TileButton className="flex-1"
                                onClick={() => setFrdsAddShown(false)}
                                disabled={frdsAddUID === ""}>
                        增加朋友
                    </TileButton>
                </div>
            </TileDialogue>
        </Overlay>
    </div>;
};
