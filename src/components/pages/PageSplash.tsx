import React, {useContext, useEffect, useState} from "react";
import LoadingSpinner from "../generic/LoadingSpinner";
import {GameContext} from "../GameProvider";
import {AnimatePresence} from "framer-motion";
import FragLogin from "./FragLogin";

export default function PageSplash() {

    const ctx = useContext(GameContext);

    useEffect(() => {
        // ctx.setErrorShown(true);
    }, []);

    const [loadingShown, setLoadingShown] = useState(true);
    useEffect(() => {
        setTimeout(() => {
            setLoadingShown(false);
        }, 2000);
    }, []);


    return <div className="absolute inset-0 flex place-items-center place-content-center bg-gradient-to-tl from-gray-800">
        {/*<FragLogin/>*/}
        {/*<div className="absolute left-8 top-8">*/}
        {/*    /!*<img src={"/img/logo.svg"} className={"w-64"}/>*!/*/}
        {/*</div>*/}
        {/*<div className="absolute left-8 bottom-8">*/}
        {/*    <img src={"/img/author.svg"} className={"w-48"}/>*/}
        {/*</div>*/}
        <div className={"absolute right-8 bottom-8"}>
            <AnimatePresence>
                {!ctx.resourceLoaded && <LoadingSpinner/>}
            </AnimatePresence>
        </div>
    </div>;
}
