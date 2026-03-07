import { prisma } from "@/lib/prisma";
import { INote, NoteType } from "@/types";
import { NextResponse, NextRequest } from "next/server";


export async function POST(req: NextRequest) {

    try {
        const { noteId } = await req.json();

        const query: any = {
            orderBy: {
                date: "desc"
            },
            take: 100
        }

        if (noteId) {
            query.where = {
                id: noteId
            }
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