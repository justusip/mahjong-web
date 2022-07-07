import classNames from "classnames";
import {IoChevronBackCircle} from "react-icons/io5";
import React from "react";

export default function HeaderButton(props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    active?: boolean
}) {
    return <button {...props}
                   className={classNames(
                       "text-xl p-4 flex place-items-center gap-2",
                       "bg-gray-700 border-x border-b-4 border-gray-800",
                       "active:mt-[4px] active:border-b-0",
                       {"mt-[4px] border-b-0 cursor-not-allowed": props.active},
                       {"hover:bg-gray-600 active:bg-gray-700 active:mt-[4px] active:border-b-0 cursor-pointer": !props.active}
                   )}>
        {props.children}
    </button>;
}
