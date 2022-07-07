export default function Milliseconds(ms: number): Promise<void> {
    return new Promise(r => setTimeout(r, ms));
}
