
export default function ToRelative<T>(selfPid: number, absoluteList: T[]): T[] {
    const relativeList = [...Array(absoluteList.length)];
    for (let pid = 0; pid < absoluteList.length; pid++)
        relativeList[pid] = absoluteList[(selfPid + pid) % 4];
    return relativeList;
}
