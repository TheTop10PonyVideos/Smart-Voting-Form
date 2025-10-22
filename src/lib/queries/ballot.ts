import { prisma } from "../prisma";
import { upsertFromUser } from "./user";


export function getBallotItems(uid: string) {
    return prisma.ballot_item.findMany({
        where: {
            user_id: uid
        },
        include: { video_metadata: true }
    })
}


export async function removeBallotItem(uid: string, index: number) {
    const now = new Date(Date.now())

    await prisma.user.update({
        where: { id: uid },
        data: {
            ballot_item: {
                delete: {
                    user_id_index: { user_id: uid, index }
                }
            },
            last_ballot_update: now
        }
    })
}


export async function setBallotItem(uid: string, index: number, video_id: string, platform: string) {
    const now = new Date(Date.now())
    const item = { video_id: video_id, platform, index }

    await upsertFromUser(
        uid,
        {
            ballot_item: {
                upsert: {
                    where: { user_id_index: { user_id: uid, index: index } },
                    update: item,
                    create: item
                }
            },
            last_ballot_update: now
        },
        {
            ballot_item: {
                create: item
            },
            last_ballot_update: now
        }
    )
}
