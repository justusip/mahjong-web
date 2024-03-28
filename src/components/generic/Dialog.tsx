import classNames from "classnames";
import React from "react";
import {AnimatePresence, motion} from "framer-motion";

export default function Dialog(props: React.PropsWithChildren<{
    shown: boolean | null | undefined,
    bgDarkened?: boolean,
    zIndex?: number
    className?: string,
    icon?: React.ReactNode,
    title?: string,
    onClick?: () => void,
}>): React.ReactElement {

    return <AnimatePresence>
        {
            props.shown && props.bgDarkened &&
            <motion.div
                key={0}
                className={classNames(
                    "absolute inset-0 bg-black/50",
                    {z: (props.zIndex || 35) - 1}
                )}
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                transition={{duration: .15}}
                onClick={props.onClick}/>
        }
        {
            props.shown &&
            <motion.div
                key={1}
                className={classNames(
                    "absolute inset-0 flex place-items-center place-content-center",
                    {z: (props.zIndex || 35)}
                )}>
                <motion.div
                    key={2}
                    className={classNames("bg-zinc-800 text-white rounded absolute shadow m-8 w-full max-w-lg")}
                    initial={{opacity: 0, scale: 0.95}}
                    animate={{opacity: 1, scale: 1}}
                    exit={{opacity: 0, scale: 0.95}}
                    transition={{duration: .15}}
                    onClick={e => e.stopPropagation()}> {/*TODO*/}
                    {
                        props.title && (
                            typeof props.title === "string" ?
                                <div className="p-4 border-b-2 border-gray-600 text-xl flex place-items-center gap-2">
                                    {props.icon}
                                    {props.title}
                                </div> :
                                props.title
                        )

                    }
                    <div className={classNames("p-4 flex flex-col gap-4", props.className)}>
                        {props.children}
                    </div>
                </motion.div>
            </motion.div>
        }
    </AnimatePresence>;
}
