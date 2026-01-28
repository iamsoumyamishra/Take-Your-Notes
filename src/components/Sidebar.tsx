"use client"
import { Key, useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
} from "@/components/ui/sidebar"
import { INotes } from "@/types";
import { useNotes } from "@/contexts/NotesHook";

export function AppSidebar() {

    const temp = [
        {
            id: 1,
            title: "Note 1",
            content: "This is the first note.",
            createdAt: "2026-01-24",
            updatedAt: "2026-01-24",
            pinned: false
        },
        {
            id: 2,
            title: "Note 2",
            content: "This is the second note.",
            createdAt: "2026-01-24",
            updatedAt: "2026-01-24",
            pinned: true
        },
        {
            id: 3,
            title: "Note 3",
            content: "Additional details go here.",
            createdAt: "2026-01-24",
            updatedAt: "2026-01-24",
            pinned: false
        }
    ]

    const { notes, setNotes } = useNotes()
    const router = useRouter()
    const params = useParams()

    useEffect(() => {
        setNotes(JSON.parse(localStorage?.getItem("notes")!) || temp)
    }, [])

    useEffect(() => {
        localStorage?.setItem("notes", JSON.stringify(notes))
    }, [notes])



    const addNote = () => {
        let name = prompt("Name of the Note")

        setNotes((prev) => {
            if (!prev) return []
            return [...prev, { id: prev && (prev.length + 1), title: name!, content: "", createdAt: Date.now(), updatedAt: Date.now(), pinned: false }]
        }
        )
    }

    const handleClickOnNoteButton = (event: unknown, id: Number) => {

        router.push(`/${params?.user}/${id}`)
    }

    return (
        <Sidebar >
            <SidebarHeader className="justify-center h-20">
                <h1 className="text-center text-3xl px-3 py-2">Notes</h1>
            </SidebarHeader>
            <hr />
            <SidebarContent className="mt-10">
                <SidebarGroup>
                    <SidebarGroupLabel className="mb-3">
                        <span className="text-xl">
                            Tools
                        </span>
                    </SidebarGroupLabel>
                    <SidebarMenu className="pl-2">
                        <SidebarMenuItem>
                            <SidebarMenuButton className="text-xl" onClick={addNote}>
                                New Note
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel className="mb-3">
                        <span className="text-xl">
                            Favourites
                        </span>
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="pl-2">
                            {
                                notes?.map((note, index) => (
                                    <SidebarMenuItem key={note.id as Key}>
                                        <SidebarMenuButton className="h-13 text-xl font-light cursor-pointer" onClick={(e) =>
                                            handleClickOnNoteButton(e, note?.id)
                                        }>
                                            {note.title}
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))
                            }
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}