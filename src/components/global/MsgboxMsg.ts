export interface MsgboxMsg {
    title?: string;
    type?: "info" | "warning" | "error";
    content?: string;
    progressing?: boolean;
}