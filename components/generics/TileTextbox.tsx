import React, {ChangeEventHandler, MouseEventHandler} from "react";

export default function TileTextbox(props: React.PropsWithChildren<{
    className: string,
    placeholder: string,
    maxLength: number,
    type?: string,
    onChange: ChangeEventHandler<HTMLInputElement> | undefined,
    value: string
}>): React.ReactElement {
    return <div className={props.className}>
        <input className="
            w-full
            h-full
            p-2
            focus:outline-none
            border-2
            hover:border-lime-500
            focus:border-lime-500
        "
               value={props.value}
               onChange={props.onChange}
               maxLength={props.maxLength}
               type={props.type}
               placeholder={props.placeholder}>
        </input>
    </div>;
}
