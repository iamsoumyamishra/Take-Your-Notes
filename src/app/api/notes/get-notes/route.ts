import { prisma } from "@/lib/prisma";
import { INote, NoteType } from "@/types";
import { NextResponse, NextRequest } from "next/server";


export async function POST(req: NextRequest) {

    try {
        const { noteId, userId } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: "No noteId or userId provided" }, { status: 400 })
        }

        const query: any = {
            where: {
                id: noteId,
                userId: userId
            },
            orderBy: {
                date: "desc"
            },
            take: 100
        }


        const rawNotes = await prisma.note.findMany(query);

        const notes: INote[] = rawNotes.map((note) => ({
            ...note,
            type: note.type as NoteType,
            url: note.url ?? undefined,
            imageUrl: note.imageUrl ?? undefined,
            content: note.content ?? undefined,
            date: note.date?.toISOString() ?? "",
        }))



        return NextResponse.json({ notes }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 })
    }
}