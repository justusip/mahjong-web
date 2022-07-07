import React from "react";
import classNames from "classnames";
import {IoChevronBackCircle, IoPersonAdd} from "react-icons/io5";
import ThreeSectionButton from "./generics/ThreeSectionButton";
import {GiShintoShrine, GiTempleGate} from "react-icons/gi";

export default function DialogueRoom(
    props: {
        onBackClicked: () => void
    }
): React.ReactElement {
    return <div className={"absolute w-full h-full bg-gray-800 flex text-white"}>
        <div className={"h-screen flex-1 flex flex-col"}>
            <div className="w-full text-2xl text-white bg-gray-700 border-b-4 border-gray-800 flex">
                <button className={classNames(
                    "text-xl cursor-pointer p-4 flex place-items-center gap-2",
                    "bg-gray-700 border-x border-b-4 border-gray-800 hover:bg-gray-600 active:bg-gray-700",
                    "active:mt-[4px] active:border-b-0",
                )}>
                    <IoChevronBackCircle/>返回
                </button>
                <div className={"bg-gray-700 border-x border-b-4 border-gray-800 flex-1 flex place-items-center p-4"}>
                    房間選項
                </div>
            </div>
            <div className={"flex-1 overflow-y-scroll"}>
                <div className={"p-4 flex flex-col gap-4"}>
                    <div className={"text-xl"}>遊戲模式</div>
                    {
                        [
                            {
                                name: "香港牌",
                                desc: "廣東牌之舊章；規則簡單，三番起糊，食糊牌型較少。"
                            },
                            {
                                name: "廣東牌",
                                desc: "廣東牌之舊章；與清章相比，增加「六獨」（平、斷、不、門、缺、眼）、「十八番」及「無奇不有」食糊牌型。"
                            },
                            {
                                name: "台灣牌",
                                desc: "廣東牌之舊章；與清章相比，增加「六獨」（平、斷、不、門、缺、眼）、「十八番」及「無奇不有」食糊牌型。"
                            },
                            {
                                name: "日本牌",
                                desc: "廣東牌之舊章；與清章相比，增加「六獨」（平、斷、不、門、缺、眼）、「十八番」及「無奇不有」食糊牌型。"
                            },
                            {
                                name: "日麻三人",
                                desc: "廣東牌之舊章；與清章相比，增加「六獨」（平、斷、不、門、缺、眼）、「十八番」及「無奇不有」食糊牌型。"
                            },
                        ].map((o, i) =>
                            <div key={i}
                                 className={classNames(
                                     "text-white transition-all",
                                     "border-b-4 active:mt-[4px] active:border-b-0",
                                     "bg-gray-700 border-gray-900 text-gray-200 hover:bg-gray-600 active:bg-gray-700",
                                     " p-4"
                                 )}>
                                <div className={"text-3xl"}>{o.name}</div>
                                <div className={"text-xl"}>{o.desc}</div>
                            </div>)
                    }
                </div>
            </div>
        </div>
        <div className={"h-screen w-[400px] flex flex-col"}>
            <div className="w-full text-2xl text-white bg-gray-700 border-b-4 border-gray-800 flex">
                <div className={"bg-gray-700 border-x border-b-4 border-gray-800 flex-1 flex place-items-center p-4"}>
                    玩家列表
                </div>
            </div>
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
