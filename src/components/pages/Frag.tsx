import classNames from "classnames";
import React from "react";
import {IoChevronBackCircle} from "react-icons/io5";

import HeaderButton from "../generic/HeaderButton";
import HeaderSection from "../generic/HeaderSection";
import Header from "../generic/Header";
import {AnimatePresence, motion} from "framer-motion";

export default function Frag(props: React.PropsWithChildren<{
    className?: string,
    header: string | React.ReactElement,
    in: boolean
    onBack?: () => void
}>) {

    return <AnimatePresence>
        {
            props.in &&
            <motion.div className="w-full h-full flex flex-col text-white"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
            >
                <div className={classNames("w-full flex-1 flex", props.className)}>
                    {props.children}
                </div>
                {
                    <Header>
                        <HeaderButton onClick={props.onBack}
                                      disabled={!props.onBack}><IoChevronBackCircle/>返回</HeaderButton>
                        {
                            typeof props.header === "string" ?
                                <HeaderSection>{props.header}</HeaderSection> :
                                props.header
                        }
                    </Header>
                }
            </motion.div>
        }
    </AnimatePresence>;
}
