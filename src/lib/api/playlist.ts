import { VideoDataClient } from "@/lib/types";

export type APIAddResponseBody = { metadata: VideoDataClient }  | { error: string} 

export type APIAddPIRequestBody = {
    link: string
    playlist_id: string
}

/**
 * Attempt to add a video to a playlist
 * @param link video url
 * @param playlist_id id of the playlist to which the video should be added to
 * @returns video metadata associated with the url, or an error message if no data could be fetched for it
 */

export async function addPlaylistItem(link: string, playlist_id: string): Promise<APIAddResponseBody> {
    const body = { link, playlist_id } satisfies APIAddPIRequestBody

    const res = await fetch("/api/playlist/add", {
        method: "POST",
        body: JSON.stringify(body)
    })

    return await res.json()
}

export type APIEditPlaylistRequestBody = {
    name: string
    description: string
    playlist_id: string
}

/**
 * Edit playlist metadata
 * @param name new name for the playlist
 * @param description new description for the playlist
 * @param playlist_id id of the playlist to edit
 */

export async function editPlaylistMeta(name: string, description: string, playlist_id: string) {
    const body = { name, description, playlist_id } satisfies APIEditPlaylistRequestBody
    const res = await fetch("/api/playlist/edit", {
        method: "POST",
        body: JSON.stringify(body)
    })

    return res.status === 200
}

export type APIRemovePIRequestBody = {
    playlist_id: string
    item_id: number
}

/**
 * Verbatim
 * @param playlist_id the id of the playlist to remove from
 * @param item_id the id of the item to remove
 */
export async function removePlaylistItem(playlist_id: string, item_id: number) {
    const uid = /uid=([^;]+)/.exec(document.cookie)?.[1]
    if (!uid)
        return

    const body = { playlist_id, item_id } satisfies APIRemovePIRequestBody

    const res = await fetch("/api/playlist/remove_item", {
        method: "POST",
        body: JSON.stringify(body)
    })

    return res.status !== 200 && await res.json() as string
}


