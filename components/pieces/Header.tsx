import classNames from "classnames";
import {IoChevronBackCircle} from "react-icons/io5";
import React from "react";

export default function Header(props: React.PropsWithChildren<{}>) {
    return <div className="w-full text-2xl text-white border-b-4 border-gray-800 flex">
        {props.children}
    </div>;
}
