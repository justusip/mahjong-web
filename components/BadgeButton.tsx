import React, {MouseEventHandler} from "react";
import classNames from "classnames";

export default function BadgeButton(props: React.HTMLProps<HTMLButtonElement>): React.ReactElement {
    return <button className={"p-8 bg-white"} onClick={props.onClick}>
        {props.children}
    </button>;
}
