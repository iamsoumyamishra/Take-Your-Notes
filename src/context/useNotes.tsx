"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { INote } from "@/types"
import { authClient } from "@/lib/auth-client";

const NotesContext = createContext<{ notes: INote[] | null; setNotes: React.Dispatch<React.SetStateAction<INote[] | null>> } | null>(null)

export const NotesProvider = ({ children }: { children: React.ReactNode }) => {
    const { data: session, isRefetching, isPending, error, refetch } = authClient.useSession()
    const [notes, setNotes] = useState<INote[] | null>(null)

    const fetchNotes = async () => {
        const response = await fetch("/api/notes/get-notes",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: session?.user?.id })
            }
        );
        const data = await response.json();

        return data


    }

    useEffect(() => {
        let mounted = true;

        if (session) {

            fetchNotes().then(data => {
                if (mounted) {
                    setNotes(data.notes);
                }
            })
        }

        return () => {
            mounted = false;
        }
    }, [session])

    return (
        <NotesContext.Provider value={{ notes, setNotes }}>
            {children}
        </NotesContext.Provider>
    )
}

export const useNotes = () => {
    const context = useContext(NotesContext)
    if (!context) {
        throw new Error("useNotes must be used within NotesProvider")
    }
    return context
}