import React, {useContext} from "react";

import {GameContext} from "../GameProvider";
import Button from "../generic/Button";
import PageType from "./PageType";
import Frag from "./Frag";
import CenterDialog from "../components/generic/CenterDialog";

export default function FragHome(props: {
    in: boolean,
    requestLogin: () => void
}): React.ReactElement {
    const ctx = useContext(GameContext);

    return <Frag in={props.in} header={"主頁"}
                 className="place-items-center place-content-center">
        <CenterDialog in={true} header="主頁">
            <Button onClick={() => {
                ctx.setPage(PageType.JOIN_ROOM);
            }}>
                私人牌局
            </Button>
        </CenterDialog>
    </Frag>;
}
