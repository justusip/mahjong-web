import React, {useEffect, useState} from "react";


const NoSSR = (props: React.PropsWithChildren) => {
    const [canRender, setCanRender] = useState(false);

    useEffect(() => {
        setCanRender(true);
    }, []);

    if (!canRender)
        return <></>;

    return <>
        {props.children}
    </>;
};

export default NoSSR;