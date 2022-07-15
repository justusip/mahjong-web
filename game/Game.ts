// import io, {Socket} from 'socket.io-client';
//
// import Room from "./graphics/Room";
// import Tile from "./mechanics/Tile";
// import PageGame from "../components/gameOld/PageGame";
// import PageRoom from "../components/room/PageRoom";
// import OverlayLogin from "../components/OverlayLogin";
// import Meld, {MeldType} from "./mechanics/Meld";
//
// export default class Game {
//     static readonly ins: Game = new Game();
//
//     setPage: (page: number) => void;
//     socket: Socket;
//     ui: PageGame;
//     scene: Room;
//
//     selfPid: number;
//     fung: 0;
//     guk: 0;
//
//     playerNames: string[];
//     scores: number[];
//     curTurn: number;
//
//     owns: Tile[];
//     drew: Tile;
//
//     flowers: Tile[][];
//     corners: Meld[][];
//     discards: Tile[];
//
//     lastDiscardIdx: number;
//
//     constructor() {
//         this.socket = io("localhost:3001",{
//             autoConnect: false
//         });
//     }
//
//     async join(roomCode: string, playerName: string): Promise<number> {
//         if (this.socket.connected)
//             return -1;
//
//         this.socket.removeAllListeners();
//         this.socket.connect();
//         await Promise.race([
//             new Promise<any>(r => this.socket.once("connect_error", r)),
//             new Promise<void>(r => this.socket.once("connect", r))
//         ]);
//
//         if (!this.socket.connected) {
//             this.socket.disconnect();
//             return -2;
//         }
//
//         this.socket.emit(
//             "roomJoin",
//             {
//                 roomCode: roomCode,
//                 playerName: playerName
//             }
//         );
//
//         const result = await new Promise<{ error: number }>(r => this.socket.once(
//             "onRoomJoin",
//             (args: { error: number }) => r(args))
//         );
//
//         const error = result.error;
//         if (error != 0) {
//             this.socket.disconnect();
//             return result.error;
//         }
//
//         this.setPage(1);
//
//         this.socket.on("onJoin", (args: any): void => {
//             this.selfPid = args["pid"];
//             this.playerNames = args["names"];
//             this.scores = [0, 0, 0, 0];
//             this.setPage(2);
//         });
//         return 0;
//     }
//
//     // onSplashMount(layoutSplash: OverlayLogin) {
//     //     layoutSplash.setState({
//     //         onConnect: async (roomCode: string, playerName: string): Promise<number> => {
//     //             return await GameManager.ins.join(roomCode, playerName);
//     //         }
//     //     });
//     // }
//
//     onRoomMount(layoutRoom: PageRoom) {
//         layoutRoom.setState({
//             onAddBot: () => this.socket.emit("roomAddBot", {}),
//             onRemoveBot: i => this.socket.emit("roomRemoveBot", {idx: i}),
//             onReady: (ready: boolean) => this.socket.emit("roomPlayerReady", {"ready": ready}),
//             onStart: () => this.socket.emit("roomStart", {})
//         });
//         this.socket.on("onRoomUpdate", (args: any): void => {
//             layoutRoom.setState({
//                 roomCode: args["roomCode"],
//                 pid: args["pid"],
//                 playerNames: args["playerNames"],
//                 ready: args["ready"]
//             });
//         });
//     }
//
//     disconnect() {
//         this.socket.disconnect();
//     }
//
//     load(layoutGame: PageGame, scene: Room) {
//         this.ui = layoutGame;
//         this.scene = scene;
//
//         this.ui.hintPlayerNames.setState({
//             pid: this.selfPid,
//             playerNames: this.playerNames
//         });
//
//         this.socket.on("onGameStart", (args: any) => {
//             this.scene.pendingDiscard = false;
//             this.owns = args["owns"].map((tid: Tile) => Tile.deserialize(tid));
//             this.drew = null;
//             //TODO read corners
//             this.corners = [[], [], [], []];
//             this.flowers = args["flowers"].map((flowers: any[]) => flowers.map((tid: Tile) => Tile.deserialize(tid)));
//             this.discards = [];
//             this.fung = args["fung"];
//             this.guk = args["guk"];
//             this.scene.table.reset(this.owns, this.flowers);
//             this.scene.onReset();
//             this.ui.popupGukStart.setState({
//                 curState: 1,
//                 fung: this.fung,
//                 guk: this.guk
//             });
//             this.scene.table.setZong(this.guk);
//             this.scene.table.setScore(this.scores);
//         });
//
//         this.socket.on("onSomeoneDrew", (args: any) => {
//             const pid: number = args["pid"];
//             const drewTile: Tile = args["tile"] !== null ? Tile.deserialize(args["tile"]) : null;
//             const left: number = args["left"];
//
//             if (this.ui.popupGukStart.state.curState) {
//                 this.ui.popupGukStart.setState({curState: 2});
//             }
//             this.ui.popupGukStart.setState({remaining: left});
//
//             this.curTurn = pid;
//             if (this.selfPid === pid) {
//                 this.drew = drewTile;
//                 if (drewTile.types !== 4) {
//                     this.scene.pendingDiscard = true;
//                 }
//             }
//             this.scene.table.onTileDrew(pid, drewTile);
//         });
//
//         this.socket.on("onSomeoneDiscard", (args: any) => {
//             const pid: number = args["pid"];
//             const tile: Tile = Tile.deserialize(args["tile"]);
//
//             if (this.selfPid === pid) {
//                 if (this.lastDiscardIdx !== -1) {
//                     this.owns.splice(this.lastDiscardIdx, 1);
//                     if (this.drew !== null)
//                         this.owns.push(this.drew);
//                     this.owns.sort((a, b) => a.compare(b));
//                 }
//                 this.drew = null;
//             }
//             this.discards.push(tile);
//             this.scene.table.onSomeoneDiscard(pid, tile, this.selfPid === pid ? this.lastDiscardIdx : null);
//         });
//
//         this.socket.on("onDecideMerge", (args: any) => {
//             const selections: Meld[] = (<any[]>args["selections"]).map((meld: any) => Meld.deserialize(meld));
//
//             this.scene.pendingDiscard = false;
//             this.ui.promptMerge.setState({
//                 shown: true,
//                 activeBtn: null,
//                 causeTile: selections[0].isSeize() ? this.discards[this.discards.length - 1] : this.drew,
//                 selections: selections,
//                 onDecideMerge: (selIdx: number): void => {
//                     this.socket.emit("decideMerge", {"selIdx": selIdx});
//                     this.ui.promptMerge.setState({shown: false});
//                     if ((selIdx === -1 && this.selfPid === this.curTurn) ||
//                         (selections[selIdx].types === MeldType.Soeng || selections[selIdx].types === MeldType.Pung)) {
//                         this.curTurn = this.selfPid;
//                         this.scene.pendingDiscard = true;
//                     }
//                 }
//             });
//         });
//
//         this.socket.on("onSomeoneMerge", (args: any) => {
//             const pid: number = args["pid"];
//             const meld: Meld = Meld.deserialize(args["meld"]);
//             if (this.selfPid === pid) {
//                 let causedByTile: Tile;
//                 if (meld.isSeize()) {
//                     causedByTile = this.discards.pop();
//                 } else {
//                     causedByTile = this.drew;
//                     this.drew = null;
//                 }
//                 if (meld.types === MeldType.GaaGong) {
//                     const corner = this.corners[this.selfPid].find(c => c.types === MeldType.Pung && c.tiles[0].equals(meld.tiles[0]));
//                     corner.tiles.push(meld.tiles[0]);
//                     corner.types = MeldType.GaaGong;
//                 } else {
//                     const andTiles = [...meld.tiles];
//                     andTiles.splice(andTiles.findIndex(t => t.equals(causedByTile)), 1);
//                     for (let t of andTiles)
//                         this.owns.splice(this.owns.findIndex(o => t.equals(o)), 1);
//                     this.corners[this.selfPid].push(meld);
//                 }
//             }
//             this.scene.table.onSomeoneMerge(pid, meld);
//         });
//
//         this.socket.on("onDecideEat", (args: any) => {
//             this.ui.promptEat.setState({
//                 shown: true,
//                 activeBtn: null,
//                 onDecideEat: (eat: boolean): void => {
//                     this.socket.emit("decideEat", {"eat": eat});
//                     this.ui.promptEat.setState({shown: false});
//                     if (!eat && this.curTurn === this.selfPid)
//                         this.scene.pendingDiscard = true;
//                 }
//             });
//             this.scene.pendingDiscard = false;
//         });
//
//         this.socket.on("onSomeoneEat", (args: any) => {
//             const pid: number = args["pid"];
//             const end: boolean = args["end"];
//
//             const tiles: Tile[] = args["tiles"].map((tid: any) => Tile.deserialize(tid));
//             const tileLast: Tile = Tile.deserialize(args["tileLast"]);
//
//             const prevScores = [...this.scores];
//             this.scores = args["scores"];
//             const scoreDiffs: number[] = args["scoreDiffs"];
//
//             this.scene.table.onSomeoneEat(pid, tiles, tileLast);
//             this.ui.popupGukStart.setState({
//                 curState: 0,
//             });
//             setTimeout(() => {
//                 this.ui.screenGukEnd.setState({
//                     shown: true,
//                     drew: false,
//                     activeBtn: null,
//
//                     pid: this.selfPid,
//                     playerNames: this.playerNames,
//                     scores: prevScores,
//                     scoreDiffs: scoreDiffs,
//
//                     sikPid: pid,
//                     handsName: args["handsName"],
//                     handsPoints: args["handsPoints"],
//                     totalPoints: args["totalPoints"],
//
//                     tiles: tiles,
//                     tileLast: tileLast,
//                     flowers: args["flowers"].map((tid: any) => Tile.deserialize(tid)),
//                     cornersFlatted: args["cornersFlatted"].map((tid: any) => Tile.deserialize(tid)),
//
//                     onCompleted: (): void => {
//                         this.ui.screenGukEnd.setState({shown: false});
//                         if (!end) {
//                             this.ready();
//                         } else {
//                             this.ui.screenGameEnd.setState({
//                                 shown: true,
//                                 activeBtn: null,
//                                 playerNames: this.playerNames,
//                                 scores: this.scores
//                             });
//                         }
//                     }
//                 });
//
//                 this.ui.screenGukEnd.animateScores(this.scores).then();
//             }, 2000);
//         });
//
//         this.socket.on("onDrew", (args: any) => {
//             this.ui.popupGukStart.setState({
//                 curState: 0,
//             });
//             setTimeout(() => {
//                 this.ui.screenGukEnd.setState({
//                     shown: true,
//                     drew: true,
//                     activeBtn: null,
//
//                     pid: this.selfPid,
//                     playerNames: this.playerNames,
//                     scores: this.scores,
//                     scoreDiffs: [0, 0, 0, 0],
//
//                     onCompleted: (): void => {
//                         this.ready();
//                         this.ui.screenGukEnd.setState({shown: false});
//                     }
//                 });
//
//                 this.ui.screenGukEnd.animateScores(this.scores).then();
//             }, 2000);
//         });
//
//         this.scene.setOnDiscard((tile: Tile) => {
//             if ([this.drew, ...this.owns].indexOf(tile) === -1)
//                 throw new Error();
//             this.lastDiscardIdx = [this.drew, ...this.owns].indexOf(tile) - 1;
//             this.socket.emit("discard", {
//                 "tile": tile.serialize()
//             });
//             this.scene.pendingDiscard = false;
//         });
//
//         this.scene.setOnTextPosUpdate((posX: number[], posY: number[]) =>
//             this.ui.hintPlayerNames.setState({posX: posX, posY: posY})
//         );
//     }
//
//     ready() {
//         this.socket.emit("ready");
//     }
// }
