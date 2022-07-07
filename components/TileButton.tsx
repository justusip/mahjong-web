import React from "react";
import classNames from "classnames";

export default function TileButton(
    props: React.HTMLProps<HTMLButtonElement> &
        {
            type?: "positive" | "negative"
        }
): React.ReactElement {
    return <div className={props.className}>
        <button className={classNames(`
            min-w-full
            border-b-4 border-b-black/10
            px-8 py-2
            bg-gray-200
            cursor-pointer
            disabled:bg-neutral-100
            disabled:text-neutral-300
            disabled:cursor-not-allowed
            hover:text-white focus:text-white enabled:active:text-white
            active:mt-[4px] active:border-b-0
            disabled:mt-0 disabled:border-b-4  
        `,
            //TODO above use enabled selector instead

            {"bg-gray-200 hover:bg-lime-500 focus:bg-lime-500 active:bg-lime-600": !props.type},
            {"bg-gray-200 hover:bg-gray-500 focus:bg-gray-500 active:bg-gray-600": props.type === "negative"}
        )} onClick={props.onClick} disabled={props.disabled}>
            {props.children}
        </button>
    </div>;
}
