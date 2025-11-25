import { prisma } from "../prisma";


export async function getUser(uid: string, create = false) {

    if (create)
        return await prisma.user.upsert({
            where: { id: uid },
            create: { id: uid },
            update: {}
        })

    return await prisma.user.findUnique({
        where: { id: uid }
    }).catch()
}
