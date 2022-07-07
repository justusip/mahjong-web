import {IoChatboxEllipses, IoHelpCircle, IoPeople, IoSettings} from "react-icons/io5";
import classNames from "classnames";
import React from "react";

export default function Footer(
    props: {
        onClicks: (() => void)[]
    }
): React.ReactElement {
    return <div className={"absolute z-30 w-full bottom-0 text-white flex place-items-stretch"}>
        <div className={"bg-gray-700 border-x border-b-4 border-gray-800 flex-1 flex place-items-center p-4"}>
            Chronica™
        </div>
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
            ].map((o, i) => <div key={i}
                                 className={classNames(
                                     "text-xl cursor-pointer p-4 flex place-items-center gap-2",
                                     "bg-gray-700 border-x border-b-4 border-gray-800 hover:bg-gray-600 active:bg-gray-700",
                                     "active:mt-[4px] active:border-b-0",
                                 )}
                                 onClick={o.onClick}>
                    {o.icon}
                    {o.name}
                </div>
            )
        }
    </div>;
}
