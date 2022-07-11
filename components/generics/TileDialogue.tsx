import React from "react";
import classNames from "classnames";
import Magnify from "../transitions/Magnify";

export default function TileDialogue(props: React.PropsWithChildren<{
    className?: string,
    in: boolean,
    header?: string,
}>): React.ReactElement {
    return <Magnify in={props.in}>
        <div className={classNames("bg-gray-700 text-white rounded absolute shadow m-8 w-full max-w-lg")}>
            {
                props.header && <div className="p-4 border-b-2 border-gray-600 text-2xl">
                    {props.header}
                </div>
            }
            <div className={classNames("p-4 flex flex-col gap-4", props.className)}>
                {props.children}
            </div>
        </div>
    </Magnify>;
}