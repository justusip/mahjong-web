import React, {useEffect, useState} from "react";
import {CSSTransition} from 'react-transition-group';
import TileButton from "./TileButton";
import Post from "../utils/PostFetch";
import Milliseconds from "../utils/Milliseconds";
import TileDialogue from "./TileDialogue";
import TileTextbox from "./TileTextbox";
import Overlay from "./Overlay";
import {useSharedState} from "./Store";

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

    const [overlayShown, setOverlayShown] = useState(false);
    const [frdsAddShown, setFrdsAddShown] = useState(false);
    const [frdsAddUid, setFrdsAddUid] = useState("");

    const [globals, setGlobals] = useSharedState();

    console.log(globals.me);
    return <>
        <Overlay shown={overlayShown}>
            <TileDialogue
                className={"w-full max-w-lg"}
                shown={frdsAddShown}
                header={
                    <div className="text-2xl font-bold">新增好友</div>
                }>
                <div className="text-gray-500">請喺下面輸入一個Username或UID。</div>
                <TileTextbox className="mt-2"
                             placeholder="Username/UID"
                             maxLength={16}
                             value={frdsAddUid}
                             onChange={e => setFrdsAddUid(e.target.value)}/>
                <div className={"flex gap-4 mt-4"}>
                    <TileButton className="flex-1"
                                type={"negative"}
                                onClick={async () => {
                                    setFrdsAddShown(false);
                                    await Milliseconds(1);
                                    setOverlayShown(false);
                                }}>
                        取消
                    </TileButton>
                    <TileButton className="flex-1"
                                onClick={async () => {
                                    setFrdsAddShown(false);
                                    await Milliseconds(1);
                                    setOverlayShown(false);
                                }}
                                disabled={frdsAddUid === ""}>
                        增加好友
                    </TileButton>
                </div>
            </TileDialogue>
        </Overlay>
        <div className="w-full h-screen bg-[url(/img/bg.jpg)] bg-cover bg-center backdrop-blur-3xl flex">
            {/*<div className="w-full flex">*/}
            {/*    <div className="flex-1 p-4">*/}
            {/*        <div className={"text-white"}>{globals.me.username}</div>*/}
            {/*    </div>*/}
            {/*    <TileButton className={``}>*/}
            {/*        <img className={"w-8 h-8"} src={"/img/friends.svg"}/>*/}
            {/*    </TileButton>*/}
            {/*</div>*/}
            <div className={"w-3/5 flex place-content-center place-items-center gap-4"}>
                {
                    [
                        {
                            icon: "",
                            name: "瑪雀聯盟",
                            desc: "同世界各地嘅麻雀玩家展開熱火朝天嘅對決"
                        },
                        {
                            name: "創建房間",
                            desc: "打開新嘅私人房間，邀請朋友一同對決"
                        },
                        {
                            name: "加入房間",
                            desc: "加入朋友創建嘅私人房間，同朋友展開對決"
                        }
                    ].map(o =>
                        <div className={"bg-white p-4 flex flex-col place-items-center gap-4 w-[200px] text-center"}>
                            <div className={"text-xl"}>{o.name}</div>
                            <div>{o.desc}</div>
                        </div>
                    )
                }
            </div>
            <CSSTransition classNames="slideleft"
                           in={frdLstShown}
                           timeout={100}
                           unmountOnExit>
                <div className={"w-full max-w-lg"}>
                </div>
            </CSSTransition>
            {/*<div className={"bg-white p-4 w-[400px]"}>*/}
            {/*    <div>好友</div>*/}
            {/*    <TileButton className={""} onClick={async () => {*/}
            {/*        setOverlayShown(true);*/}
            {/*        await Milliseconds(1);*/}
            {/*        setFrdsAddShown(true);*/}
            {/*    }}>新增好友</TileButton>*/}
            {/*    {*/}
            {/*        friends.length === 0 ?*/}
            {/*            <div>None</div> :*/}
            {/*            friends.map(friend =>*/}
            {/*                <div>{friend}</div>*/}
            {/*            )*/}
            {/*    }*/}
            {/*</div>*/}
        </div>
    </>;
};
