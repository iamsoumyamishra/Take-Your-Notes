import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { INote } from "@/types";

export async function POST(req: NextRequest) {
    try {
        const { title, type, content, url, tags, imageUrl, userId }: INote = await req.json();
        const note = await prisma.note.create({
            data: {
                title,
                type,
                content: content || "",
                date: new Date().toISOString(),
                url,
                imageUrl,
                tags,
                userId
            },
        });
        return NextResponse.json({ note });
    } catch (error) {
        console.error("Error creating note:", error);
        return NextResponse.json({ error: "Failed to create note" }, { status: 500 });
    }
}
