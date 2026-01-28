"use client"

import { INotes } from "@/types";
import { createContext, useContext, useEffect, useState } from "react";

interface INotesContext {
    notes: INotes[] | null;
    setNotes: React.Dispatch<React.SetStateAction<INotes[] | null>>
}

const NotesContext = createContext<INotesContext | null>(null)

export function NotesProvider({children}: {children: React.ReactNode}) {

    const [notes, setNotes] = useState<INotes[] | null>(null)


    const value: INotesContext = {notes, setNotes}; 

    return (
        <NotesContext.Provider value={value}>
            {children}
        </NotesContext.Provider>
    )
}

export function useNotes(){

    const context = useContext(NotesContext)
    if (!context) throw new Error("useNotes must be used within the provider");
    return context
} 
