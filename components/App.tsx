import PageLogin from "./PageLogin";
import PageMain from "./PageMain";
import React, {useEffect, useState} from "react";
import {useSharedState} from "./Store";
import IsUsingMobile from "../utils/IsUsingMobile";
import Resources from "../game/graphics/Resources";
import PageTest from "./PageTest";


export default function App(): React.ReactElement {
    const [globals, setGlobals] = useSharedState();

    const [usingMobile, setUsingMobile] = useState(false);

    useEffect(() => {
        setUsingMobile(IsUsingMobile());
        if (usingMobile)
            return;
        // Resources.load().then();
    }, []);

    if (usingMobile) {
        return <div>請使用電腦瀏覽此網站。</div>;
    }

    return <>
        {
            [
                <PageTest/>,
                <PageLogin/>,
                <PageMain/>
            ][globals.page]
        }
    </>;
}
