import React from "react";
import classNames from "classnames";

export default function IntrinsicButton(
    props: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }
): React.ReactElement {
    return <button {...props}
                   className={classNames(
                       "text-white transition-all p-2",
                       "border-b-4 border-black/10 text-gray-200",
                       {"active:mt-[4px] bg-gray-600 active:border-b-0 hover:bg-gray-500 active:bg-gray-500 cursor-pointer": !props.disabled && !props.active},
                       {"mt-[4px] border-b-0 cursor-not-allowed bg-gray-800 opacity-50": !props.disabled && props.active},
                       {"grayscale opacity-50 bg-gray-700": props.disabled},
                       props.className
                   )}>
        {props.children}
    </button>;
}
