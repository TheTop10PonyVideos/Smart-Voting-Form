import { APIRemoveBIRequestBody } from "@/lib/api/ballot";
import { removeBallotItem } from "@/lib/queries/ballot";
import { getUser } from "@/lib/queries/user";
import { NextRequest } from "next/server";

// Route for removing entries from ballots or playlists
export async function POST(request: NextRequest) {
    const uid = request.cookies.get("uid")?.value
    if (!uid) return new Response()

    const user = await getUser(uid)
    if (!user) return new Response(null, { status: 400 })

    const body: APIRemoveBIRequestBody = await request.json()

    if (typeof body.index !== "number")
        return new Response(null, { status: 400 })

    await removeBallotItem(uid, body.index)

    return new Response()
}
