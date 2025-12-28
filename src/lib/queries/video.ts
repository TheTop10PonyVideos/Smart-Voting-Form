import { video_metadata } from "@/generated/prisma";
import { prisma } from "../prisma";
import { VideoPlatform, VideoStatusSettings } from "../types";
import { adjustDate } from "../util";


export async function getVideoMetadata(id: string, platform: VideoPlatform, with_annotation: boolean) {
    const metadata = await prisma.video_metadata.findUnique({
        where: {
            id_platform: {
                id: id,
                platform: platform
            }
        },
        include: {
            manual_label: with_annotation
        }
    })

    if (metadata == null)
        return metadata

    adjustDate(metadata)
    return metadata
}


export async function saveVideoMetadata(video_data: video_metadata) {
    return prisma.video_metadata.create({ data: video_data }).catch(console.log);
}


export async function annotateVideo(video_id: string, platform: VideoPlatform, status: Exclude<VideoStatusSettings, "default" | "reupload">, annotation: string) {
    return prisma.manual_label.upsert({
        where: {
            video_id_platform: { video_id, platform }
        },
        create: {
            video_id, platform,
            label: status,
            content: annotation
        },
        update: {
            label: status,
            content: annotation
        }
    })
}


export async function removeVideoAnnotation(video_id: string, platform: VideoPlatform) {
    return prisma.manual_label.delete({
        where: {
            video_id_platform: { video_id, platform }
        }
    })
}


export async function setSource(video_id: string, platform: VideoPlatform, annotation: string) {
    return prisma.video_metadata.update({
        where: { id_platform: { id: video_id, platform } },
        data: { source: annotation }
    })
}


export async function updateWhitelist(video_id: string, platform: VideoPlatform, whitelisted: boolean) {
    return prisma.video_metadata.update({
        where: {
            id_platform: { id: video_id, platform }
        },
        data: { whitelisted }
    })
}


export async function titleSearchMetadata(query: string, threshold = 0.6): Promise<video_metadata[]> {
    const results: (video_metadata & {sim: number})[] = await prisma.$queryRaw`
    WITH v AS (
        SELECT *, word_similarity(${query}, title) AS sim
        FROM video_metadata
        WHERE recent AND whitelisted
    )
    SELECT *
    FROM v
    WHERE sim > ${threshold}
    ORDER BY sim DESC
    LIMIT 3;
    `

    return results.map(res => { const {sim, ...metadata} = res; return metadata })
}
