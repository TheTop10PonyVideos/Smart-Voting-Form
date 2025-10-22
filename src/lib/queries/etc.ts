import { video_metadata } from "@/generated/prisma";
import { prisma } from "../prisma";
import { Flag } from "../types";


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
    ]);

    return { users, video_metadata, ballot_item, label_config, manual_label, playlist, playlist_item };
}export function setLabelConfigs(new_configs: Flag[]) {
    return prisma.$transaction(
        new_configs.map(config => prisma.label_config.update({
            where: { trigger: config.trigger },
            data: config
        })
        )
    );
}

export async function getPool() {
    const result = await prisma.$queryRaw`
    SELECT v.*, COUNT(CASE WHEN b.user_id IS NOT NULL THEN 1 END) votes
    FROM video_metadata v
    LEFT JOIN ballot_item b
        ON b.video_id = v.id AND b.platform = v.platform
    GROUP BY v.id, v.platform
    ORDER BY votes DESC
    LIMIT 30;
    ` as (video_metadata & { votes: number; })[];

    return result.map(item => ({ ...item, votes: Number(item.votes) }));
}
export function getLabelConfigs() {
    return prisma.label_config.findMany() as Promise<Flag[]>;
}

