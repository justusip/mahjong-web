import {useState} from "react";
import Resources from "../../game/graphics/Resources";

export default function PageLoading() {

    return <div className={"w-screen h-screen overflow-hidden bg-neutral-900"}>
        <div className={"absolute inset-x-8 bottom-8 flex"}>
            <img width={200} src={"/img/logo.png"}/>
        </div>
        <div className={"absolute right-8 bottom-8 text-neutral-300"}>Justus Ip © 2020, 2022</div>
    </div>;
}
