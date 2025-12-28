import { requireAuth } from "@/app/api/authorization";
import { annotateVideo as annotateVideo, removeVideoAnnotation, setSource, updateWhitelist } from "@/lib/queries/video";
import { NextRequest } from "next/server";
import { APIAnnotateVideoRequestBody } from "@/lib/api/video";


async function handler(req: NextRequest) {
    const body: APIAnnotateVideoRequestBody = await req.json()

    if (typeof body.whitelisted === 'boolean')
        updateWhitelist(body.video_id, body.platform, body.whitelisted)

    if (!body.status)
        return new Response(null, { status: body.annotation ? 400 : 200 })

    if (body.status === "default") {
        removeVideoAnnotation(body.video_id, body.platform).catch()
        setSource(body.video_id, body.platform, "")
    }
    else if (body.status === "reupload") {
        if (!body.annotation)
            return new Response(null, { status: 400 })

        setSource(body.video_id, body.platform, body.annotation)
    }
    else {
        if (!body.annotation)
            return new Response(null, { status: 400 })

        annotateVideo(body.video_id, body.platform, body.status, body.annotation)
    }

    return new Response()
}

export const POST = requireAuth(handler)
