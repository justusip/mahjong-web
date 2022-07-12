import React, {useEffect, useState} from "react";

export default function PageTest2(): React.ReactElement {
    // const [content, setContent] = useState("");
    // const print = (msg: string) => {
    //     const line = "[+][" + new Date().toLocaleString() + "] " + msg;
    //     setContent(content + line + "\n");
    // }
    // useEffect(() => {
    //     const s = io("ws://localhost:1234");
    //     s.on("connect", () => print("Connected"));
    //     s.on("disconnect", () => print("Disconnected"));
    // }, []);
    //
    // return <div className={"w-full h-screen bg-neutral-900 p-4 text-white font-mono"}>
    //     {content.split("\n").map(o => <>{o}<br/></>)}
    // </div>;
    return <div className={"w-full h-screen bg-neutral-900 p-4 text-white font-mono"}/>;
};
