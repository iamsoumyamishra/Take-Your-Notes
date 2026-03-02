import { prisma } from "@/lib/prisma";
import { INote, NoteType } from "@/types";
import { NextResponse } from "next/server";


export async function POST() {

    try {
        const rawNotes = await prisma.note.findMany();
        const notes: INote[] = rawNotes.map((note) => ({
            ...note,
            type: note.type as NoteType,
            url: note.url ?? undefined,
            imageUrl: note.imageUrl ?? undefined,
            content: note.content ?? undefined,
        }))

        return NextResponse.json({ notes }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 })
    }
}