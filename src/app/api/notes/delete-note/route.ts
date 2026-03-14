import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const { noteId, userId } = await req.json();
        console.log(userId)

        if (!userId || !noteId) {
            return NextResponse.json({ error: "No noteId or userId provided" }, { status: 400 })
        }

        const note = await prisma.note.delete({
            where: {
                userId: userId,
                id: noteId
            }
        });
        return NextResponse.json({ note }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Failed to delete note" }, { status: 500 })
    }
}