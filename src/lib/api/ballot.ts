export type APIRemoveBIRequestBody = { index: number} 

/**
 * Remove an entry from a ballot
 * @param index the index of the ballot entry to remove
 */
export async function removeBallotItem(index: number) {
    const uid = /uid=([^;]+)/.exec(document.cookie)?.[1]
    if (!uid)
        return

    const body: APIRemoveBIRequestBody = { index }

    const res = await fetch("/api/ballot/remove_item", {
        method: "POST",
        body: JSON.stringify(body)
    })

    return res.status !== 200 && await res.json() as string
}
