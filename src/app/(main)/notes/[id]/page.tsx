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
            <div className="sticky top-0 z-10 w-full px-4 py-3 bg-background/80 backdrop-blur-xl flex items-center justify-between transition-all opacity-100 border-b border-border/50 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
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
            <div className="flex-1 w-full max-w-[900px] xl:max-w-[1000px] mx-auto px-4 sm:px-8 md:px-16 py-8 md:py-10 pb-32">

                {/* Immersive Background Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-primary/5 blur-[120px] rounded-full pointer-events-none -translate-z-10" />

                <div className="animate-in fade-in duration-500 ease-out">
                    {/* Document Title */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 leading-tight wrap-break-word font-serif text-foreground drop-shadow-sm">
                        {note?.title}
                    </h1>

                    {/* Compact Horizontal Properties */}
                    <div className="flex flex-wrap items-center gap-3 sm:gap-5 mb-8 text-sm text-muted-foreground border-b border-border/40 pb-5">
                        <div className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-default">
                            <Calendar size={15} />
                            <span className="font-medium">
                                {note?.date ? new Date(note.date).toLocaleDateString("en-US", {
                                    month: 'short', day: 'numeric', year: 'numeric'
                                }) : "Unknown Date"}
                            </span>
                        </div>

                        <div className="h-4 w-px bg-border/60 hidden sm:block"></div>

                        <div className="flex items-center gap-2">
                            {note?.type && note.type.length > 0 ? (
                                note.type.map((t) => (
                                    <span
                                        key={t}
                                        className={`flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-accent/30 border shadow-sm transition-transform hover:scale-105 cursor-default ${getTypeColor(t)}`}
                                    >
                                        {getTypeIcon(t)}
                                        <span>{t}</span>
                                    </span>
                                ))
                            ) : (
                                <span className="text-muted-foreground/70 italic text-xs">Note</span>
                            )}
                        </div>

                        {note?.content && (
                            <>
                                <div className="h-4 w-px bg-border/60 hidden sm:block"></div>
                                <div className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-default">
                                    <FileText size={15} />
                                    <span className="font-medium">{note.content.split(/\s+/).filter(Boolean).length} words</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Document Content Rendering */}
                <div className="w-full animate-in fade-in duration-500 ease-out">

                    {/* Prose Document Content First! */}
                    {note?.content && (
                        <div className="prose prose-zinc dark:prose-invert prose-lg xl:prose-xl max-w-none prose-p:leading-relaxed prose-headings:font-bold prose-a:text-blue-500 mb-10">
                            <p className="whitespace-pre-wrap text-foreground/90 font-medium">
                                {note.content}
                            </p>
                        </div>
                    )}

                    {/* Image Block */}
                    {note?.type?.includes("Image") && note?.imageUrl && (
                        <div className="w-full mb-12 group relative rounded-2xl bg-accent/5 border border-border/50 shadow-sm overflow-hidden flex items-center justify-center p-2">
                            <div className="absolute inset-0 bg-linear-to-tr from-primary/5 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                            <img
                                src={note.imageUrl}
                                alt={note.title}
                                className="w-full h-auto max-h-[800px] object-contain rounded-xl relative z-10 transition-transform duration-700 group-hover:scale-[1.01]"
                            />
                        </div>
                    )}

                    {/* Bookmark/Link Block */}
                    {note?.type?.includes("Link") && note?.url && (
                        <a
                            href={note.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full mb-10 p-6 bg-linear-to-br from-accent/30 to-background border border-border/60 rounded-2xl hover:bg-accent/40 transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl shadow-sm relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full group-hover:bg-blue-500/20 transition-colors pointer-events-none" />
                            <div className="flex gap-5 items-start relative z-10">
                                <div className="p-4 bg-background rounded-xl border border-border/50 group-hover:border-blue-500/30 group-hover:bg-blue-500/10 transition-colors shadow-sm shrink-0">
                                    <LinkIcon size={28} className="text-blue-500" />
                                </div>
                                <div className="flex-1 min-w-0 pt-0.5">
                                    <h4 className="text-xl font-bold text-foreground group-hover:text-blue-500 transition-colors mb-1.5">
                                        Open Web Bookmark
                                    </h4>
                                    <p className="text-muted-foreground text-sm flex items-center max-w-full font-medium">
                                        <span className="truncate">{note.url}</span>
                                        <ExternalLink size={14} className="ml-2 shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
                                    </p>
                                </div>
                            </div>
                        </a>
                    )}

                </div>

            </div>
        </div>
    );
}