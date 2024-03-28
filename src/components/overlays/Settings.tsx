import React from "react";

import Dialog from "../generic/Dialog";

export default function FriendList(props: {
    shown: boolean,
    setShown: (shown: boolean) => void
}) {
    return <Dialog shown={props.shown}
                   onClick={() => props.setShown(false)}
                   centered={true}

                   title="設定">
        <div className="h-16">TBA</div>
    </Dialog>;
}
