import { Flag, VideoStatusSettings, VideoPlatform, VideoDataClient } from '@/lib/types';
import { label_key } from '../labels';


export type APIValidateRequestBody = {
    link: string
    index?: number
}

export type APIValidateResponseBody = {
    field_flags: Flag[]
    video_data?: VideoDataClient
}

/**
 * Check the eligibility of a video given its url and keep track of its entry position
 * @param link video url
 * @param index ballot index to save the link at. can be omitted for the server not to save the ballot entry
 * @returns An array of eligibility flags, and, if present, video metadata associated with the link
 */
export async function validate(link: string, index?: number): Promise<APIValidateResponseBody> {
    const body = { link, index } satisfies APIValidateRequestBody

    const res = await fetch('/api/ballot/validate', {
        method: 'POST',
        body: JSON.stringify(body),
        credentials: index === undefined ? 'omit' : 'same-origin'
    })

    return await res.json()
}


export type APILabelUpdateRequestBody = { label_updates: Record<label_key, Flag>} 
/**
 * Update the label details shown in ballot entries when videos have these labels
 * @param label_updates New label data to replace corresponding existing ones. Should never contain manual labels
 */
export async function updateLabels(label_updates: Record<label_key, Flag>) {
    const body = { label_updates } satisfies APILabelUpdateRequestBody

    const res = await fetch('/api/label_update', {
        method: 'POST',
        body: JSON.stringify(body)
    })

    return res
}


export type APIAnnotateVideoRequestBody = {
    video_id: string
    platform: VideoPlatform
    status?: VideoStatusSettings
    whitelisted?: boolean
    annotation?: string
}    

/**
 * Annotate a video to override its auto assigned eligibility status and notes that are shown to the voters. 
 * @param video_id The video's id
 * @param platform The platform hosting the video
 * @param status A FlagStatus or 'default' to signal that tnhe manual label shouldn't be used
 * @param whitelisted Whether the video should appear in search results
 * @param annotation The reason for the eligibility annotation or source url if status is 'alternative'
 */
export async function annotateVideo(video_id: string, platform: VideoPlatform, status: VideoStatusSettings, annotation: string, whitelisted: boolean) {
    const body = { video_id, platform, status, whitelisted, annotation } satisfies APIAnnotateVideoRequestBody

    const res = await fetch('/api/pool/annotate_video', {
        method: 'POST',
        body: JSON.stringify(body)
    })    

    return res
}


export type APIVideoSearchResponseBody = { search_results: VideoDataClient[] }

export async function videoSearch(query: string): Promise<APIVideoSearchResponseBody> {
    const res = await fetch(`/api/video/search?q=${encodeURIComponent(query)}`, { method: 'GET' })
    return await res.json()
}
