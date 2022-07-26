export default async function PostFetch(path: string, body: any) {
    return await fetch(path, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });
}
