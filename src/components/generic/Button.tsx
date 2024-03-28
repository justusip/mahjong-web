import classNames from "classnames";
import React from "react";

export default function Button(
    props: React.ButtonHTMLAttributes<HTMLButtonElement>
): React.ReactElement {
    return <button {...props}
                   className={classNames(
                       "min-w-full",
                       "border-b-4 border-b-black/10",
                       "px-8 py-2",
                       "bg-gray-700",
                       "cursor-pointer",
                       "disabled:bg-neutral-100",
                       "disabled:text-neutral-300",
                       "disabled:cursor-not-allowed",
                       "hover:text-white focus:text-white enabled:active:text-white",
                       "active:mt-[4px] active:border-b-0",
                       "disabled:mt-0 disabled:border-b-4",
                       "hover:bg-gray-600 focus:bg-gray-500 active:bg-gray-700"
                   )}
                   onClick={props.onClick}
                   disabled={props.disabled}>
        {props.children}
    </button>;
}
