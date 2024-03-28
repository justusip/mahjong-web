import React, {useContext, useEffect, useState} from "react";
import {IoCheckmarkCircle, IoCloseCircle} from "react-icons/io5";

import {GameContext} from "../GameProvider";
import {ms} from "@/utils/AsyncUtils";
import {AnimatePresence, motion} from "framer-motion";

export default function ServerStatus() {
    const ctx = useContext(GameContext);
    const [shown, setShown] = useState(false);

    useEffect(() => {
        (async () => {
            setShown(true);
            await ms(2000);
            setShown(false);
        })();
    }, [ctx.isConnected]);

    return <AnimatePresence>
        {
            shown &&
            <motion.div className="absolute z-40 bottom-4 right-4 p-4 bg-black text-white flex place-items-center gap-2"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}>
                {
                    ctx.isConnected ? <><IoCheckmarkCircle/>已經連接遊戲伺服器</> : <>
                        <IoCloseCircle/>已經失去同遊戲伺服器嘅連線</>
                }
            </motion.div>
        }
    </AnimatePresence>;
}
