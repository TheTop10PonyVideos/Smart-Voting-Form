import { prisma } from "../prisma";
import { Flag } from "../types";
import { adjustDate } from "../util";


export async function getAllData() {
    const [
        users, video_metadata, ballot_item, playlist, playlist_item, label_config, manual_label
    ] = await Promise.all([
        prisma.user.findMany(),
        prisma.video_metadata.findMany(),
        prisma.ballot_item.findMany(),
        prisma.playlist.findMany(),
        prisma.playlist_item.findMany(),
        prisma.label_config.findMany(),
        prisma.manual_label.findMany()
    ])

    return { users, video_metadata, ballot_item, label_config, manual_label, playlist, playlist_item }
}


export function setLabelConfigs(new_configs: Flag[]) {
    return prisma.$transaction(
        new_configs.map(config => prisma.label_config.update({
            where: { trigger: config.trigger },
            data: config
        }))
    )
}


export async function getPool() {
    return (
        await prisma.video_metadata.findMany({
            include: {
                manual_label: true,
                _count: { select: { ballot_item: true } }
            },
            orderBy: { ballot_item: { _count: "desc" } },
            take: 45
        })
    ).map(v => {
        adjustDate(v)
        return {
            ...v,
            votes: v._count.ballot_item
        }
    })
}


export function getLabelConfigs() {
    return prisma.label_config.findMany() as Promise<Flag[]>
}
