import { requireAuth } from "@/app/api/authorization";
import { annotateVideo as annotateVideo, removeVideoAnnotation, setSource, updateVisibility as updateWhitelisted } from "@/lib/queries/video";
import { NextRequest } from "next/server";
import { APIAnnotateVideoRequestBody } from "@/lib/api/video";


async function handler(req: NextRequest) {
    const body: APIAnnotateVideoRequestBody = await req.json()

    if (body.status === "default") {
        removeVideoAnnotation(body.video_id, body.platform).catch()
        setSource(body.video_id, body.platform, "")
    }
    else if (body.status === "reupload")
        setSource(body.video_id, body.platform, body.annotation)
    else
        annotateVideo(body.video_id, body.platform, body.status, body.annotation)

    updateWhitelisted(body.video_id, body.platform, body.whitelisted)
    return new Response
}

export const POST = requireAuth(handler)
