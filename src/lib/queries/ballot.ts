import { prisma } from "../prisma";
import { getEarliestEligibleDate } from "../util";


export function getBallotItems(uid: string) {
    return prisma.ballot_item.findMany({
        where: {
            user_id: uid, creation_date: { gte: getEarliestEligibleDate() }
        },
        include: {
            video_metadata: {
                include: { manual_label: true }
            }
        }
    })
}


export async function removeBallotItem(uid: string, index: number) {
    await prisma.ballot_item.delete({
        where: { user_id_index: { user_id: uid, index } }
    })
}


export async function setBallotItem(uid: string, index: number, video_id: string, platform: string) {
    const item = { video_id: video_id, platform, index, creation_date: new Date(Date.now()) }

    await prisma.user.upsert({
        where: { id: uid },
        update: {
            ballot_item: {
                upsert: {
                    where: { user_id_index: { user_id: uid, index: index } },
                    update: item,
                    create: item
                }
            }
        },
        create: {
            id: uid,
            ballot_item: {
                create: item
            }
        }
    })
}
