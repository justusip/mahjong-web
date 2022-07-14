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
                       {"active:mt-[4px] active:border-b-0 hover:bg-gray-600 active:bg-gray-700 active:mt-[4px] active:border-b-0 cursor-pointer": !props.disabled && !props.active},
                       {"mt-[4px] border-b-0 cursor-not-allowed": !props.disabled && props.active},
                       {"grayscale opacity-50 bg-gray-700": props.disabled},
                   )}>
        {props.children}
    </button>;
}
