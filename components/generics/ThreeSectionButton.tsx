import React from "react";
import classNames from "classnames";
import {IoAddCircle} from "react-icons/io5";
import IntrinsicButton from "./IntrinsicButton";

export default function ThreeSectionButton(
    props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
        icon: React.ReactElement,
        name: string,
        desc: string,
        active?: boolean
    }
): React.ReactElement {
    return <IntrinsicButton {...props}
                            className={classNames("p-8 gap-4", props.className)}>
        <div className={"h-3/5 flex flex-col place-items-center place-content-end gap-4"}>
            <div className={"text-6xl"}>{props.icon}</div>
            <div className={"text-2xl"}>{props.name}</div>
        </div>
        <div className={"h-2/5 flex flex-col place-items-center mt-4"}>{props.desc}</div>
    </IntrinsicButton>;
}
