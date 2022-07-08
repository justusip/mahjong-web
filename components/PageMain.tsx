import React, {useEffect, useState} from "react";
import TileButton from "./generics/TileButton";
import Post from "../utils/PostFetch";
import TileDialogue from "./generics/TileDialogue";
import TileTextbox from "./generics/TileTextbox";
import Overlay from "./pieces/Overlay";
import {useSharedState} from "./Store";
import classNames from "classnames";
import {IoChevronBackCircle,} from "react-icons/io5";
import Footer from "./pieces/Footer";
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


    const [settingsShown, setSettingsShown] = useState(false);
    const [frdLstShown, setFrdLstShown] = useState(false);

    const [friends, setFriends] = useState<{ username: string, online: boolean }[]>([]);
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
        "bg-[url(/img/bg.jpg)]a bg-gray-900 bg-cover bg-center",
        "flex flex-col flex-col-reverse overflow-hidden"
    )}>
        <CSSTransition classNames="slideup" in={page == 0} timeout={200} unmountOnExit>
            <Footer onClicks={[() => setSettingsShown(true), () => setFrdLstShown(true), null, null]}/>
        </CSSTransition>
        <CSSTransition classNames="slideup" in={page >= 1 && page <= 3} timeout={200} unmountOnExit>
            <Header>
                <HeaderButton onClick={() => setPage(0)}><IoChevronBackCircle/>返回</HeaderButton>
                <HeaderSection>私人牌局</HeaderSection>
            </Header>
        </CSSTransition>

        <FadeIn in={page == 0}><FragHome setPage={setPage}/></FadeIn>
        <FadeIn in={page == 1}><FragJoinOrCreateRoom setPage={setPage}/></FadeIn>
        <FadeIn in={page == 2}><FragRoom onBackClicked={() => setPage(1)}/></FadeIn>
        <FadeIn in={page == 3}><FragJoinRoom onBackClicked={() => setPage(1)}/></FadeIn>

        <OverlayDialogue shown={settingsShown}
                         transition={"magnify"}
                         onClick={() => setSettingsShown(false)}
                         centered={true}
                         header={"設定"}>
            <div className={"h-16"}>TBA</div>
        </OverlayDialogue>
        <Overlay shown={frdLstShown}
                 transition={"slideleft"}
                 onClick={() => setFrdLstShown(false)}>
            <div className={"h-screen w-[400px] bg-gray-800 text-white p-4 flex flex-col gap-4 shadow-xl"}
                 onClick={e => e.stopPropagation()}>
                <div className={"text-xl"}>朋友清單</div>
                <div className={"p-2 border"}
                     onClick={async () => {
                         setFrdsAddShown(true);
                         await ms(1);
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
        <TileDialogue className={"w-full max-w-lg"}
                      in={frdsAddShown}
                      header={"新增朋友"}>
            請喺下面輸入一個Username或UID。
            <TileTextbox className="mt-2"
                         placeholder="Username/UID"
                         maxLength={16}
                         value={frdsAddUID}
                         onChange={e => setFrdsAddUID(e.target.value)}/>
            <div className={"flex gap-4 mt-4"}>
                <TileButton className="flex-1"
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
    </div>;
};
