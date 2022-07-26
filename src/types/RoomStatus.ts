export default interface RoomStatus {
    code: string;
    mode: "hk" | "jp" | "jp3" | "tw" | "bw";
    players: { uuid: string, name: string, ready: boolean }[];
    iAm: number;
}
