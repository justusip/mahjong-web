import React from "react";
import classNames from "classnames";

export default function IntrinsicButton(
    props: React.ButtonHTMLAttributes<HTMLButtonElement>
): React.ReactElement {
    return <button {...props}
                   className={classNames(
                       "text-white transition-all",
                       "border-b-4 active:mt-[4px] active:border-b-0",
                       "bg-gray-700 border-gray-900 text-gray-200 hover:bg-gray-600 active:bg-gray-700",
                       props.className
                   )}>
        {props.children}
    </button>;
}
