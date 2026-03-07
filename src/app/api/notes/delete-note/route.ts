import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const { noteId } = await req.json();
        const note = await prisma.note.delete({
            where: {
                id: noteId
            }
        });
        return NextResponse.json({ note }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Failed to delete note" }, { status: 500 })
    }
}