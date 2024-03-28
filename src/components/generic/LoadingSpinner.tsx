import {motion} from "framer-motion";
import React from "react";

export default function LoadingSpinner() {
    const duration = .75;
    const delay = [0, 0.25, .75, .5];

    return <motion.div className="grid grid-cols-2 gap-1"
                       initial={{opacity: 0}}
                       animate={{opacity: 1}}
                       exit={{opacity: 0}}>
        {
            [...Array(4)].map(
                (_, i) =>
                    <motion.div key={i}
                                className="w-2 h-2 bg-white"
                                animate={{opacity: [.2, 1, .2]}}
                                transition={{
                                    ease: "linear",
                                    duration,
                                    repeat: Infinity,
                                    delay: delay[i] * duration
                                }}/>
            )
        }
    </motion.div>;
}