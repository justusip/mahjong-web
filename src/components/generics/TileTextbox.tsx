import React from "react";

export default function TileTextbox(props: React.InputHTMLAttributes<HTMLInputElement>): React.ReactElement {
    return <div className={props.className}>
        <input {...props}
               className="w-full h-full p-2 focus:outline-none border-2 border-gray-500 hover:border-gray-300 focus:border-gray-300 placeholder-neutral-500">
        </input>
    </div>;
}
