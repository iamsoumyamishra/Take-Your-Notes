"use client";

import React, { useState } from 'react';
import { useNotes } from '@/context/useNotes';
import { useRouter } from 'next/navigation';
import { FileText, Image as ImageIcon, Link as LinkIcon, Calendar, Search, ArrowUpDown, Clock } from 'lucide-react';

const getTypeIcon = (type: string[]) => {
    if (type?.includes("Link")) return <LinkIcon size={16} className="text-blue-500" />;
    if (type?.includes("Image")) return <ImageIcon size={16} className="text-purple-500" />;
    return <FileText size={16} className="text-emerald-500" />;
};

const AllNotesPage = () => {
    const { notes } = useNotes();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");

    const filteredNotes = notes?.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (note.content && note.content.toLowerCase().includes(searchQuery.toLowerCase()))
    ) || [];

    // Format date in a short way
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    return (
        <div className="flex-1 w-full max-w-[1000px] mx-auto px-4 sm:px-8 md:px-12 py-8 md:py-12 pb-32">

            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight font-serif bg-linear-to-br from-foreground to-foreground/70 bg-clip-text text-transparent drop-shadow-sm">
                        File Explorer
                    </h1>
                    <p className="text-muted-foreground mt-2 text-sm md:text-base font-medium">
                        Browse all your notes in a compact list view.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="relative group w-full md:w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={16} className="text-muted-foreground group-focus-within:text-primary transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search files..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-accent/30 hover:bg-accent/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium backdrop-blur-sm"
                    />
                </div>
            </div>

            {/* List View Container */}
            <div className="w-full border border-border/50 rounded-xl overflow-hidden bg-background shadow-sm animate-in fade-in duration-500 ease-out">

                {/* List Header (File Explorer Style) */}
                <div className="hidden md:grid grid-cols-[auto_1fr_150px_120px] items-center gap-4 bg-accent/30 px-5 py-3 border-b border-border/50 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    <div className="w-8"></div>
                    <div className="flex items-center gap-1.5 cursor-pointer hover:text-foreground transition-colors">Name <ArrowUpDown size={12} className="opacity-50" /></div>
                    <div className="flex items-center gap-1.5 cursor-pointer hover:text-foreground transition-colors">Date Modified</div>
                    <div className="text-right flex items-center justify-end gap-1.5 cursor-pointer hover:text-foreground transition-colors">Size</div>
                </div>

                {/* Notes List */}
                <div className="flex flex-col divide-y divide-border/40 bg-accent/5">
                    {notes === null ? (
                        <div className="p-8 text-center text-muted-foreground animate-pulse font-medium text-sm">Loading files...</div>
                    ) : filteredNotes.length === 0 ? (
                        <div className="p-16 text-center flex flex-col items-center">
                            <FileText size={48} className="text-muted-foreground/20 mb-4" />
                            <p className="text-muted-foreground font-medium text-lg">This folder is empty.</p>
                            <p className="text-sm text-muted-foreground/70 mt-1">Try a different search term or add a new note.</p>
                        </div>
                    ) : (
                        filteredNotes.map((note) => (
                            <div
                                key={note.id}
                                onClick={() => router.push(`/notes/${note.id}`)}
                                className="group grid grid-cols-[auto_1fr] md:grid-cols-[auto_1fr_150px_120px] items-center gap-4 px-4 md:px-5 py-3.5 hover:bg-accent/50 cursor-pointer transition-colors"
                            >
                                {/* Left Icon */}
                                <div className="w-8 h-8 flex items-center justify-center bg-background rounded-lg group-hover:scale-110 transition-transform shadow-sm border border-border/50">
                                    {getTypeIcon(note.type)}
                                </div>

                                {/* Title and Mobile Info */}
                                <div className="flex flex-col min-w-0 pr-2 pt-0.5">
                                    <span className="font-semibold text-foreground truncate group-hover:text-primary transition-colors text-[15px]">
                                        {note.title || "Untitled Note"}
                                    </span>
                                    {/* Mobile only attributes */}
                                    <div className="flex items-center gap-3 mt-1 md:hidden text-[11px] text-muted-foreground font-medium">
                                        <span className="flex items-center gap-1"><Calendar size={10} /> {formatDate(note.date)}</span>
                                        <span className="bg-background px-1.5 rounded border border-border/30 shadow-sm">{note.content ? `${note.content.split(/\s+/).filter(Boolean).length} words` : note.url ? 'Web Link' : 'Media'}</span>
                                    </div>
                                </div>

                                {/* Desktop Date */}
                                <div className="hidden md:flex items-center text-[13px] text-muted-foreground font-medium truncate">
                                    {formatDate(note.date)}
                                </div>

                                {/* Desktop Size/Info */}
                                <div className="hidden md:flex justify-end text-[13px] text-muted-foreground font-medium">
                                    <span className="bg-background px-2 py-0.5 rounded shadow-sm border border-border/40">
                                        {note.content ? `${note.content.split(/\s+/).filter(Boolean).length} words` : note.url ? 'Bookmark' : 'Media File'}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Status Bar */}
                <div className="bg-accent/20 px-4 py-2.5 border-t border-border/50 text-xs text-muted-foreground font-medium flex justify-between items-center rounded-b-xl">
                    <span className="bg-background px-2 py-0.5 rounded shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] border border-border/40">{filteredNotes.length} item{filteredNotes.length !== 1 && 's'}</span>
                    <span className="flex items-center gap-1.5"><Clock size={12} className="opacity-70" /> Last synced</span>
                </div>
            </div>

        </div>
    );
};

export default AllNotesPage;