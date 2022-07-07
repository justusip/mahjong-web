import React from "react";
import classNames from "classnames";

export default function TileDialogue(props: React.PropsWithChildren<{
    className?: string,
    header?: React.ReactElement,
}>): React.ReactElement {
    return <div className={classNames("bg-white rounded absolute shadow m-8 w-full max-w-lg")}>
        {props.header &&
            <div className="p-4">
                {props.header}
            </div>
        }
        <div className={classNames("p-4 border-t-2", props.className)}>
            {props.children}
        </div>
    </div>;
}
