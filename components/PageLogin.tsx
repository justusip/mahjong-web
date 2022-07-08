import React, {useEffect, useState} from "react";
import IntrinsicButton from "./generics/IntrinsicButton";
import TileTextbox from "./generics/TileTextbox";
import TileDialogue from "./generics/TileDialogue";
import Post from "../utils/PostFetch";
import {useSharedState} from "./Store";
import {ms} from "../utils/Delay";

export default function PageLogin(): React.ReactElement {
    const [globals, setGlobals] = useSharedState();

    const [page, setPage] = useState(0);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [email, setEmail] = useState("");
    const [pass2, setPass2] = useState("");

    const [errorMsg, setErrorMsg] = useState("");
    const [prevPage, setPrevPage] = useState(0);

    useEffect(() => {
        (async () => {
            const res = await Post("/api/return", {});
            if (res.ok) {
                const js = await res.json();
                if (js.ok) {
                    setGlobals((prev) => ({...prev, page: 1, me: js.me}));
                    return;
                }
            }

            await ms(100);
            setPage(1);
        })();
    }, []);

    const msg = {
        SERVER_UNREACHABLE: "未能連接至伺服器。請稍後再嘗試。",
        PASSWORD_TOO_SHORT: "密碼太短。請打最少六隻字。",
        PASSWORDS_NOT_MATCH: "密碼唔一樣！",
        UNEXPECTED_ERROR: "有error。請再試過。",
        USERNAME_OR_PASSWORD_WRONG: "username或密碼錯咗！"
    };

    const error = (msg: string) => {
        setPrevPage(page);
        setErrorMsg(msg);
        setPage(-1);
    };

    const onPlayClicked = async () => {
        setPage(2);
        const res = await Post("/api/valid", {username});
        if (!res.ok)
            return error(msg.SERVER_UNREACHABLE);
        const js = await res.json();
        if (js.ok) {
            setPage(4);
        } else {
            setPage(5);
        }
    };

    const onLoginClicked = async () => {
        setPage(2);
        const res = await Post("/api/login", {
            username,
            password
        });
        if (!res.ok)
            return error(msg.SERVER_UNREACHABLE);
        const js = await res.json();
        if (!js.ok)
            return error(msg.USERNAME_OR_PASSWORD_WRONG);
        setGlobals((prev) => ({...prev, page: 1, me: js.me}));
    };

    const onRegisterClicked = async () => {
        if (password.length < 6)
            return error(msg.PASSWORD_TOO_SHORT);
        if (password !== pass2)
            return error(msg.PASSWORDS_NOT_MATCH);
        setPage(2);
        const res = await Post("/api/register", {
            username,
            email,
            password
        });
        if (!res.ok)
            return error(msg.SERVER_UNREACHABLE);
        const js = await res.json();
        if (!js.ok)
            return error(msg.UNEXPECTED_ERROR);
        setGlobals((prev) => ({...prev, page: 1})); //TODO
    };

    return <div className="w-full h-screen bg-gray-800 flex place-content-center place-items-center">
        <TileDialogue in={page == -2} className={"flex place-items-center"}>
            <div className={"flex"}>
                <img className={"w-4 h-4 animate-spin"} src="/img/loading.svg"/>
                <div className={"ml-2"}>載入中</div>
            </div>
        </TileDialogue>
        <TileDialogue in={page == -1}
                      header={`錯誤`}>
            <div className={"text-1xl"}>{errorMsg}</div>
            <IntrinsicButton onClick={async () => setPage(prevPage)}>
                確定
            </IntrinsicButton>
        </TileDialogue>
        <TileDialogue in={page == 1} header={`歡迎返嚟`}>
            請喺下面輸入你嘅用户名稱。
            <TileTextbox placeholder="顯示名稱" maxLength={16} value={username}
                         onChange={e => setUsername(e.target.value)}/>
            <IntrinsicButton onClick={onPlayClicked} disabled={username === ""}>遊玩</IntrinsicButton>
        </TileDialogue>
        <TileDialogue in={page == 4} header={`歡迎返嚟，{username}！`}>
            呢個名係屬於一個已經註冊咗嘅帳戶，如果你係想登入呢個帳戶嘅話，請喺下面打密碼，否則請返去用過第二個名。
            <TileTextbox placeholder="密碼"
                         maxLength={16}
                         type={"password"}
                         value={password}
                         onChange={e => setPassword(e.target.value)}/>
            <div className={"flex gap-4"}>
                <IntrinsicButton className="flex-1"
                                 onClick={async () => {
                                     setPassword("");
                                     setPage(1);
                                 }}>
                    取消
                </IntrinsicButton>
                <IntrinsicButton className="flex-1"
                                 onClick={onLoginClicked}
                                 disabled={password === ""}>
                    登入
                </IntrinsicButton>
            </div>
        </TileDialogue>
        <TileDialogue in={page == 5} header={`歡迎，${username}！`}>
            呢個名未被註冊，如果你想用呢個名註冊帳戶嘅話，請喺下面留低你嘅電郵地址同諗個密碼，否則你可以以訪客身份繼續。
            <TileTextbox placeholder="電郵地址"
                         maxLength={64}
                         type={"email"}
                         value={email}
                         onChange={e => setEmail(e.target.value)}/>
            <TileTextbox placeholder="密碼"
                         maxLength={64}
                         type={"password"}
                         value={password}
                         onChange={e => setPassword(e.target.value)}/>
            <TileTextbox placeholder="再打一次密碼"
                         maxLength={64}
                         type={"password"}
                         value={pass2}
                         onChange={e => setPass2(e.target.value)}/>
            <div className={"flex gap-4 mt-4"}>
                <IntrinsicButton onClick={() => {
                    setPassword("");
                    setPass2("");
                    setPage(1);
                }}>
                    取消
                </IntrinsicButton>
                <IntrinsicButton className="flex-1"
                                 onClick={async _ => {
                                 }}>
                    以訪客身份繼續
                </IntrinsicButton>
                <IntrinsicButton className="flex-1"
                                 onClick={onRegisterClicked}
                                 disabled={password === "" || pass2 === "" || email === ""}>
                    註冊賬戶
                </IntrinsicButton>
            </div>
        </TileDialogue>
    </div>;
};

