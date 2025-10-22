import { video_metadata } from "@/generated/prisma";
import { prisma } from "../prisma";
import { VideoPlatform, VideoStatusSettings } from "../types";


export function getVideoMetadata(id: string, platform: string) {
    return prisma.video_metadata.findUnique({
        where: {
            id_platform: {
                id: id,
                platform: platform
            }
        }
    })
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


export async function updateVisibility(video_id: string, platform: VideoPlatform, whitelisted: boolean) {
    return prisma.video_metadata.update({
        where: {
            id_platform: { id: video_id, platform }
        },
        data: { whitelisted }
    })
}
