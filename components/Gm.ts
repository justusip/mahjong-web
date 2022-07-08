// import {io, Socket} from "socket.io-client";
// import {ms} from "../utils/Delay";
//
// class GameManager {
//
//     s: Socket;
//
//     async request(msg: string, ...args: any[]) {
//         this.s.send(msg + "-req", args);
//         return await Promise.any([
//             new Promise(resolve => this.s.once(msg + "-res", args => resolve(args))),
//             async () => {
//                 await ms(1000);
//                 throw new Error("TimeoutException");
//             }
//         ]);
//     }
//
//     constructor() {
//         this.s = io("ws://localhost:3001");
//         this.s.on("handshake", () => {
//             console.log("ok");
//         });
//     }
//
//     async joinRoom(code: string): Promise<boolean> {
//         if (!code.match(/\d\d\d\d/g))
//             return false;
//         try {
//             await this.request("join");
//         } catch (ex) {
//             return false;
//         }
//     }
//
//     leaveRoom(code: number) {
//
//     }
// }
//
// console.log("ass");
// const gm = new GameManager();
// export {gm};
