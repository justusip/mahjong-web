import React from "react";

export default function HeaderSection(props: React.PropsWithChildren<{}>) {
    return <div className="bg-gray-700 border-x border-b-4 border-gray-800 flex-1 flex place-items-center p-4">
        {props.children}
    </div>;
}
