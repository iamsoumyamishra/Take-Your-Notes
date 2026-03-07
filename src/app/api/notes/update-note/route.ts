import { NextRequest, NextResponse } from "next/server";
import { INote } from "@/types";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {

    try {
        let { title, type, content, url, imageUrl, noteId, tags } = await req.json();

        const note = await prisma.note.update({
            where: {
                id: noteId
            },
            data: {
                title,
                content,
                imageUrl,
                tags,
                url,
                type,
                date: new Date().toLocaleDateString(),
            }
        });

        return NextResponse.json({ note }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Failed to update note" }, { status: 500 })
    }
}

