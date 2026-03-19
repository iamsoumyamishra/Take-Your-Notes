"use client"

import { INote } from "@/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Image as ImageIcon, Link as LinkIcon, FileText, Calendar, ExternalLink, Edit2, Trash2 } from "lucide-react";
import Spinner from "@/components/Spinner";
import { useNotes } from "@/context/useNotes";
import { useRouter } from "nextjs-toploader/app";
import { useSession } from "@/lib/auth-client";
import { useTopLoader } from "nextjs-toploader";

const getTypeIcon = (type: string) => {
    switch (type) {
        case "Link":
            return <LinkIcon size={14} className="text-type-blue" />;
        case "Image":
            return <ImageIcon size={14} className="text-type-purple" />;
        default:
            return <FileText size={14} className="text-type-emerald" />;
    }
};

const getTypeColor = (type: string) => {
    switch (type) {
        case "Link":
            return "text-type-blue border-type-blue/20";
        case "Image":
            return "text-type-purple border-type-purple/20";
        default:
            return "text-type-emerald border-type-emerald/20";
    }
};

export default function NotePage() {
    const router = useRouter();
    const params: any = useParams();
    const [note, setNote] = useState<INote | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { notes, setNotes } = useNotes();
    const { data: session, error, isPending, isRefetching, refetch } = useSession()
    const loader = useTopLoader()

    useEffect(() => {
        // Wait until global notes context has populated
        if (notes === null) {
            setIsLoading(true);
            return;
        }

        // Find the matching note from the existing context state
        const foundNote = notes.find((n) => n.id === params?.id);

        setNote(foundNote || null);
        setIsLoading(false);

    }, [notes, params?.id]);

    if (isLoading) {
        return (
            <Spinner message="Loading your note..." />
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
                        className="flex items-center space-x-2 px-6 py-3 bg-foreground text-background rounded-xl font-bold hover:scale-105 transition-transform cursor-pointer"
                    >
                        <ArrowLeft size={18} />
                        <span>Back</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-background text-foreground scrollbar-none w-full relative selection:bg-blue-200 dark:selection:bg-blue-900">
            {/* Minimal Header */}
            <div className="sticky top-0 z-10 w-full px-4 py-3 bg-background/90 backdrop-blur-md flex items-center justify-between transition-all opacity-100 border-b border-border/50">
                <button
                    onClick={() => router.push("/")}
                    className="flex flex-row items-center space-x-2 p-2 px-3 rounded-lg hover:bg-accent hover:text-foreground text-muted-foreground font-medium transition-colors cursor-pointer text-sm"
                    title="Back"
                >
                    <ArrowLeft size={16} />
                    <span>Back</span>
                </button>

                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => router.push(`/notes/edit/${note?.id}`)}
                        className="flex items-center space-x-2 px-3 py-1.5 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 rounded-lg font-medium transition-colors text-sm cursor-pointer"
                    >
                        <Edit2 size={14} />
                        <span className="hidden sm:inline">Edit Page</span>
                    </button>
                    <button
                        onClick={async () => {
                            loader.start();
                            if (!confirm("Are you sure you want to delete this note?")) {
                                loader.done();
                                return;
                            }
                            const deleteNote = async () => {
                                const res = await fetch("/api/notes/delete-note", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({ noteId: note?.id, userId: session?.user?.id }),
                                });

                                return res.json();
                            };

                            deleteNote().then(res => {
                                if (res.error) {
                                    alert(res.error);
                                    loader.done();
                                    return;
                                }
                                setNotes(notes && notes.filter((n) => n.id !== note?.id));
                                loader.done();
                                router.push("/");
                                router.refresh();
                            });
                        }}
                        className="flex items-center space-x-2 px-3 py-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg font-medium transition-colors text-sm cursor-pointer"
                    >
                        <Trash2 size={14} />
                        <span className="hidden sm:inline">Delete</span>
                    </button>
                </div>
            </div>

            {/* Document Body */}
            <div className="flex-1 w-full max-w-[900px] xl:max-w-[1000px] mx-auto px-6 sm:px-12 md:px-16 py-12 md:py-20 pb-32">

                {/* Document Title */}
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-10 leading-tight wrap-break-word font-serif">
                    {note?.title}
                </h1>

                {/* Document Properties Table (Notion style) */}
                <div className="flex flex-col gap-4 mb-14 py-6 border-y border-border/40 text-[15px]">
                    <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                        <div className="flex items-center gap-2 text-muted-foreground font-medium">
                            <Calendar size={16} />
                            <span>Created</span>
                        </div>
                        <div className="text-foreground">
                            {note?.date ? new Date(note.date).toLocaleDateString("en-US", {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            }) : "Unknown Date"}
                        </div>
                    </div>

                    <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                        <div className="flex items-center gap-2 text-muted-foreground font-medium">
                            <FileText size={16} />
                            <span>Type</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {note?.type && note.type.length > 0 ? (
                                note.type.map((t) => (
                                    <span
                                        key={t}
                                        className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-sm font-medium bg-accent/50 ${getTypeColor(t)}`}
                                    >
                                        {getTypeIcon(t)}
                                        <span>{t}</span>
                                    </span>
                                ))
                            ) : (
                                <span className="text-muted-foreground italic">None</span>
                            )}
                        </div>
                    </div>

                    {note?.content && (
                        <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                            <div className="flex items-center gap-2 text-muted-foreground font-medium">
                                <FileText size={16} />
                                <span>Words</span>
                            </div>
                            <div className="text-foreground font-medium">
                                {note.content.split(/\s+/).filter(Boolean).length} words • {note.content.length} chars
                            </div>
                        </div>
                    )}
                </div>

                {/* Document Content Rendering */}
                <div className="w-full">

                    {/* Image Block */}
                    {note?.type?.includes("Image") && note?.imageUrl && (
                        <div className="w-full my-8 group relative rounded-lg bg-accent/5 border border-border/50">
                            <img
                                src={note.imageUrl}
                                alt={note.title}
                                className="w-full h-auto max-h-[800px] object-contain rounded-lg shadow-sm"
                            />
                        </div>
                    )}

                    {/* Bookmark/Link Block */}
                    {note?.type?.includes("Link") && note?.url && (
                        <a
                            href={note.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full my-8 p-6 bg-accent/20 border border-border/50 rounded-xl hover:bg-accent/30 transition-all duration-200 group"
                        >
                            <div className="flex gap-4 items-start">
                                <div className="p-3 bg-background rounded-lg border border-border/50 group-hover:bg-blue-500/10 transition-colors">
                                    <LinkIcon size={24} className="text-blue-500" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold text-foreground group-hover:text-blue-500 transition-colors mb-1">
                                        Web Bookmark
                                    </h4>
                                    <p className="text-muted-foreground break-all text-sm flex items-center">
                                        {note.url}
                                        <ExternalLink size={14} className="ml-2 inline shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
                                    </p>
                                </div>
                            </div>
                        </a>
                    )}

                    {/* Prose Document Content */}
                    <div className="prose prose-zinc dark:prose-invert prose-lg xl:prose-xl max-w-none prose-p:leading-relaxed prose-headings:font-bold prose-a:text-blue-500 mt-8">
                        <p className="whitespace-pre-wrap text-foreground/90 font-medium">
                            {note?.content}
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}