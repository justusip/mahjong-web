import React from "react";


export default function FragLoginOld(props: {}): React.ReactElement {
    // const [page, setPage] = useState(0);
    //
    // const [username, setUsername] = useState("");
    // const [password, setPassword] = useState("");
    //
    // const [email, setEmail] = useState("");
    // const [pass2, setPasswordAgain] = useState("");
    //
    // const [errorMsg, setErrorMsg] = useState("");
    // const [prevPage, setPrevPage] = useState(0);
    //
    // const [overlayShown, setOverlayShown] = useState(false); //TODO remove
    // useEffect(() => {
    //     (async () => {
    //         if (props.shown) {
    //             setOverlayShown(true);
    //             await ms(1);
    //             setPage(1);
    //         } else {
    //             setPage(10);
    //             await ms(1);
    //             setOverlayShown(false);
    //         }
    //     })();
    // }, [props.shown]);
    //
    // useEffect(() => {
    //     (async () => {
    //         const res = await Post("/api/return", {});
    //         if (res.ok) {
    //             const js = await res.json();
    //             if (js.ok) {
    //                 props.onLogin(js.me);
    //                 return;
    //             }
    //         }
    //
    //         await ms(100);
    //         setPage(1);
    //     })();
    // }, []);
    //
    // const msg = {
    //     SERVER_UNREACHABLE: "未能連接至伺服器。請稍後再嘗試。",
    //     PASSWORD_TOO_SHORT: "密碼太短。請打最少六隻字。",
    //     PASSWORDS_NOT_MATCH: "密碼唔一樣。",
    //     UNEXPECTED_ERROR: "發生錯誤，請再試一次。",
    //     USERNAME_OR_PASSWORD_WRONG: "密碼錯誤，請再試一次。"
    // };
    //
    // const error = (msg: string) => {
    //     setPrevPage(page);
    //     setErrorMsg(msg);
    //     setPage(-1);
    // };
    //
    // const onPlayClicked = async () => {
    //     setPage(-2);
    //     const res = await Post("/api/exist", {username});
    //     if (!res.ok)
    //         return error(msg.SERVER_UNREACHABLE);
    //     const js = await res.json();
    //     if (js.ok) {
    //         setPage(2);
    //     } else {
    //         setPage(3);
    //     }
    // };
    //
    // const onLoginClicked = async () => {
    //     setPage(-2);
    //     const res = await Post("/api/login", {
    //         username,
    //         password
    //     });
    //     if (!res.ok)
    //         return error(msg.SERVER_UNREACHABLE);
    //     const js = await res.json();
    //     if (!js.ok)
    //         return error(msg.USERNAME_OR_PASSWORD_WRONG);
    //     props.onLogin(js.me);
    //     // setGlobals((prev) => ({...prev, page: 1, me: js.me}));
    // };
    //
    // const onRegisterClicked = async () => {
    //     if (password.length < 6)
    //         return error(msg.PASSWORD_TOO_SHORT);
    //     if (password !== pass2)
    //         return error(msg.PASSWORDS_NOT_MATCH);
    //     setPage(-2);
    //     const res = await Post("/api/register", {
    //         username,
    //         email,
    //         password
    //     });
    //     if (!res.ok)
    //         return error(msg.SERVER_UNREACHABLE);
    //     const js = await res.json();
    //     if (!js.ok)
    //         return error(msg.UNEXPECTED_ERROR);
    // };
    //
    // return <CSSTransition classNames="fade"
    //                       in={overlayShown}
    //                       timeout={100}
    //                       unmountOnExit>
    //     <div className={classNames(
    //         "absolute z-40 inset-0 bg-black/50",
    //         "flex place-items-center place-content-center"
    //     )}
    //          onClick={() => props.setShown(false)}>
    //         <TileDialogue in={page === -1}
    //                       header={`錯誤`}>
    //             <div className={"text-1xl"}>{errorMsg}</div>
    //             <IntrinsicButton onClick={async () => setPage(prevPage)}>
    //                 確定
    //             </IntrinsicButton>
    //         </TileDialogue>
    //         <TileDialogue in={page === 1} header={`登入`}>
    //             請註冊帳號以遊玩公開牌局同瑪都聯盟，同世界各地嘅麻雀玩家切磋；以及用其他僅已登入玩家先可以用嘅功能。
    //             <TileTextbox maxLength={16}
    //                          value={username}
    //                          placeholder={"電子郵件"}
    //                          onChange={e => setUsername(e.target.value)}/>
    //             <TileTextbox placeholder="密碼"
    //                          maxLength={64}
    //                          type={"password"}
    //                          value={password}
    //                          onChange={e => setPassword(e.target.value)}/>
    //             <div className={"flex gap-4"}>
    //                 <IntrinsicButton className={"flex-1"} onClick={() => setPage(10)}>註冊</IntrinsicButton>
    //                 <IntrinsicButton className={"flex-1"} onClick={() => setPage(10)}
    //                                  disabled={username === ""}>登入</IntrinsicButton>
    //             </div>
    //         </TileDialogue>
    //         <TileDialogue in={page === 4} header={`註冊`}>
    //             <TileTextbox placeholder="密碼"
    //                          maxLength={64}
    //                          type={"password"}
    //                          value={password}
    //                          onChange={e => setPassword(e.target.value)}/>
    //             <TileTextbox placeholder="重複一次密碼"
    //                          maxLength={64}
    //                          type={"password"}
    //                          value={pass2}
    //                          onChange={e => setPasswordAgain(e.target.value)}/>
    //             <div className={"flex w-full gap-4"}>
    //                 <IntrinsicButton className={"flex-1"}
    //                                  onClick={() => {
    //                                      setPassword("");
    //                                      setPasswordAgain("");
    //                                      setPage(1);
    //                                  }}>
    //                     取消
    //                 </IntrinsicButton>
    //                 <IntrinsicButton className={"flex-1"}
    //                                  onClick={onRegisterClicked}
    //                                  disabled={password === "" || pass2 === "" || email === ""}>
    //                     註冊賬戶
    //                 </IntrinsicButton>
    //             </div>
    //         </TileDialogue>
    //         <OverlayDialogue shown={page === 10} centered={true} header={"錯誤"}>
    //             <div className={"px-2 bg-red-600 text-white"}>錯誤代碼：ERROR_AUTH_STIG</div>
    //             發生錯誤。請稍候再嘗試。
    //             <TileButton onClick={() => props.setShown(false)}>確定</TileButton>
    //         </OverlayDialogue>
    //     </div>
    // </CSSTransition>;
    return <></>;
};

