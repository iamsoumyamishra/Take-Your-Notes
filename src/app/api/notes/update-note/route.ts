import { NextRequest, NextResponse } from "next/server";
import { INote } from "@/types";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {

    try {
        let { title, type, content, url, imageUrl, noteId, tags, userId } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const note = await prisma.note.update({
            where: {
                id: noteId,
                userId
            },
            data: {
                title,
                content,
                imageUrl,
                tags,
                url,
                type,
                date: new Date().toISOString(),
            }
        });

        return NextResponse.json({ note }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Failed to update note" }, { status: 500 })
    }
}

