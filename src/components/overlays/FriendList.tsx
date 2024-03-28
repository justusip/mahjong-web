import React, {useState} from "react";

import Button from "../generic/Button";
import CenterDialog from "../generic/CenterDialog";
import Textbox from "../generic/Textbox";
import Overlay from "../generic/Overlay";
import {ms} from "@/utils/AsyncUtils";

export default function FriendList(props: {
    shown: boolean,
    setShown: (shown: boolean) => void
}) {
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

    const [friends, setFriends] = useState<{ username: string, online: boolean }[]>([]);
    const [frdsAddShown, setFrdsAddShown] = useState(false);
    const [frdsAddUID, setFrdsAddUID] = useState("");

    return <>
        <Overlay shown={props.shown}
                 transition="slideleft"
                 onClick={() => props.setShown(false)}>
            <div className="h-screen w-[400px] bg-gray-800 text-white p-4 flex flex-col gap-4 shadow-xl"
                 onClick={e => e.stopPropagation()}>
                <div className="text-xl">朋友清單</div>
                <div className="p-2 border"
                     onClick={async () => {
                         props.setShown(true);
                         await ms(1);
                         props.setShown(true);
                     }}>
                    新增朋友...
                </div>
                {
                    // friends.length === 0 ?
                    //     <div className={"flex-1 flex place-content-center place-items-center"}>你未有加入任何朋友。</div> :
                    //     friends.map((friend, i) => <div key={i}>{friend}</div>)
                }
            </div>
        </Overlay>
        <CenterDialog className="w-full max-w-lg"
                      in={frdsAddShown}
                      header="新增朋友">
            請喺下面輸入一個Username或UID。
            <Textbox className="mt-2"
                     placeholder="Username/UID"
                     maxLength={16}
                     value={frdsAddUID}
                     onChange={e => setFrdsAddUID(e.target.value)}/>
            <div className="flex gap-4 mt-4">
                <Button className="flex-1"
                        onClick={() => setFrdsAddShown(false)}>
                    取消
                </Button>
                <Button className="flex-1"
                        onClick={() => setFrdsAddShown(false)}
                        disabled={frdsAddUID === ""}>
                    增加朋友
                </Button>
            </div>
        </CenterDialog>
    </>;
}
