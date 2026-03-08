"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { INote } from "@/types"

const NotesContext = createContext<{ notes: INote[] | null; setNotes: React.Dispatch<React.SetStateAction<INote[] | null>> } | null>(null)

export const NotesProvider = ({ children }: { children: React.ReactNode }) => {
    const [notes, setNotes] = useState<INote[] | null>(null)

    const fetchNotes = async () => {
        const response = await fetch("/api/notes/get-notes",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({})
            }
        );
        const data = await response.json();

        return data


    }

    useEffect(() => {
        let mounted = true;

        fetchNotes().then(data => {
            console.log(2)
            if (mounted) {
                setNotes(data.notes);
            }
        })

        return () => {
            mounted = false;
        }
    }, [])

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