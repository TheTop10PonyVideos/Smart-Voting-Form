import { requireAuth } from "../../authorization";
import { annotateVideo as annotateVideo, removeVideoAnnotation, updateWhitelist } from "@/lib/database";
import { NextRequest } from "next/server";
import { APIAnnotateVideoRequestBody } from "@/lib/api";

async function handler(req: NextRequest) {
    const body: APIAnnotateVideoRequestBody = await req.json()

    if (body.status === "default")
        removeVideoAnnotation(body.video_id, body.platform)
    else
        annotateVideo(body.video_id, body.platform, body.status, body.annotation)

    updateWhitelist(body.video_id, body.platform, body.whitelisted)
    return new Response
}

export const GET = requireAuth(handler)
