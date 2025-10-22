import { prisma } from "../prisma";


export async function upsertFromUser(
    uid: string,
    update: Parameters<typeof prisma.user.update>[0]["data"],
    create: Omit<Parameters<typeof prisma.user.create>[0]["data"], "id" | "last_active">
) {
    const now = new Date(Date.now())

    await prisma.user.upsert({
        where: { id: uid },
        update: { ...update, last_active: now },
        create: { ...create, id: uid, last_active: now }
    })
}


export async function getUser(uid: string, create = false) {
    const now = new Date(Date.now())

    if (create)
        return await prisma.user.upsert({
            where: { id: uid },
            update: { last_active: now },
            create: { id: uid, last_active: now }
        })
    
    try {
        return await prisma.user.update({
            where: { id: uid },
            data: { last_active: now },
        })
    } catch {}
}
