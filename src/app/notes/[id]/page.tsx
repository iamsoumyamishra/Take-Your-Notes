"use client"

import { INote } from "@/types";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Image as ImageIcon, Link as LinkIcon, FileText, Calendar, ExternalLink, Edit2, Trash2 } from "lucide-react";

const getTypeIcon = (type: string) => {
    switch (type) {
        case "Link":
            return <LinkIcon size={16} className="text-blue-500" />;
        case "Image":
            return <ImageIcon size={16} className="text-purple-500" />;
        default:
            return <FileText size={16} className="text-emerald-500" />;
    }
};

const getTypeColor = (type: string) => {
    switch (type) {
        case "Link":
            return "bg-blue-500/10 text-blue-500 border-blue-500/20";
        case "Image":
            return "bg-purple-500/10 text-purple-500 border-purple-500/20";
        default:
            return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    }
};

export default function NotePage() {
    const router = useRouter();
    const params: any = useParams();
    const [note, setNote] = useState<INote | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const response = await fetch(`/api/notes/get-notes`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ noteId: params?.id }),
                });
                const data = await response.json();
                return data;
            } catch (error) {
                console.error("Failed to fetch note:", error);
                return null;
            }
        };

        let mounted = true;
        if (mounted) {
            setIsLoading(true);
            fetchNote().then((data) => {
                if (data && data.notes && data.notes.length > 0) {
                    setNote(data.notes[0]);
                }
                setIsLoading(false);
            });
        }
        return () => {
            mounted = false;
        };
    }, [params?.id]);

    if (isLoading) {
        return (
            <div className="flex-1 p-8 h-screen overflow-y-auto w-full bg-background flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-12 h-12 rounded-full border-4 border-violet-500/30 border-t-violet-500 animate-spin" />
                    <p className="text-muted-foreground font-medium animate-pulse">Loading your note...</p>
                </div>
            </div>
        );
    }

    if (!note) {
        return (
            <div className="flex-1 p-8 h-screen overflow-y-auto w-full bg-background">
                <div className="max-w-4xl mx-auto flex flex-col items-center justify-center h-full text-center">
                    <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mb-6">
                        <FileText size={32} className="text-muted-foreground" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">Note not found</h2>
                    <p className="text-muted-foreground mb-8">The note you are looking for does not exist or has been deleted.</p>
                    <button
                        onClick={() => router.push("/")}
                        className="flex items-center space-x-2 px-6 py-3 bg-foreground text-background rounded-xl font-bold hover:scale-105 transition-transform"
                    >
                        <ArrowLeft size={18} />
                        <span>Back to Dashboard</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 p-4 md:p-8 h-screen overflow-y-auto bg-background text-foreground scrollbar-none w-full">
            <div className="max-w-4xl mx-auto pb-24">
                {/* Header Actions */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => router.push("/")}
                        className="flex flex-row items-center space-x-2 p-2 px-4 rounded-xl hover:bg-accent hover:text-foreground text-muted-foreground font-medium transition-colors border border-transparent hover:border-border"
                        title="Back to Dashboard"
                    >
                        <ArrowLeft size={18} />
                        <span>Dashboard</span>
                    </button>

                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => router.push(`/notes/edit/${note.id}`)}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 rounded-xl font-medium transition-colors border border-blue-500/20"
                        >
                            <Edit2 size={16} />
                            <span className="hidden sm:inline">Edit</span>
                        </button>
                        <button
                            onClick={() => console.log("Delete note")}
                            className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl font-medium transition-colors border border-red-500/20"
                        >
                            <Trash2 size={16} />
                            <span className="hidden sm:inline">Delete</span>
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <article className="bg-card border border-border rounded-3xl p-6 md:p-10 shadow-sm">
                    {/* Tags / Types */}
                    <div className="flex flex-wrap gap-3 mb-6">
                        {note.type && note.type.map((t) => (
                            <span
                                key={t}
                                className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-semibold border ${getTypeColor(
                                    t
                                )}`}
                            >
                                {getTypeIcon(t)}
                                <span>{t}</span>
                            </span>
                        ))}
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-6 leading-tight break-all">
                        {note.title}
                    </h1>

                    {/* Metadata */}
                    <div className="flex items-center text-sm font-medium text-muted-foreground mb-8 pb-8 border-b border-border">
                        <div className="flex items-center bg-accent/50 px-3 py-1.5 rounded-lg">
                            <Calendar size={16} className="mr-2" />
                            {note.date ? new Date(note.date).toDateString() : "Unknown Date"}
                        </div>
                    </div>

                    {/* Image Render */}
                    {note.type?.includes("Image") && note.imageUrl && (
                        <div className="w-full relative rounded-2xl overflow-hidden border border-border bg-accent/5 mb-8">
                            <img
                                src={note.imageUrl}
                                alt={note.title}
                                className="w-full h-auto max-h-[600px] object-contain"
                            />
                        </div>
                    )}

                    {/* Link Render */}
                    {note.type?.includes("Link") && note.url && (
                        <a
                            href={note.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group block p-4 bg-accent/10 border border-border rounded-2xl hover:bg-accent/20 transition-colors mb-8"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-background rounded-xl flex items-center justify-center border border-border shrink-0 group-hover:scale-105 transition-transform">
                                    <LinkIcon size={20} className="text-blue-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-foreground text-lg mb-1 group-hover:text-blue-500 transition-colors">
                                        Open Link
                                    </h4>
                                    <p className="text-sm text-muted-foreground truncate flex items-center">
                                        {note.url}
                                        <ExternalLink size={14} className="ml-2 inline shrink-0" />
                                    </p>
                                </div>
                            </div>
                        </a>
                    )}

                    {/* Textual Content */}
                    <div className="prose prose-zinc dark:prose-invert max-w-none w-full">
                        <p className="text-lg leading-relaxed text-foreground whitespace-pre-wrap">
                            {note.content}
                        </p>
                    </div>
                </article>
            </div>
        </div>
    );
}