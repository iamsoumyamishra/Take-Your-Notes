"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft, Image as ImageIcon, Link as LinkIcon, FileText, Upload, Save, Tag } from "lucide-react";
import { useParams } from "next/navigation";
import { NoteType } from "@/types";
import { useTopLoader } from "nextjs-toploader";
import { useRouter } from "nextjs-toploader/app";
import { useNotes } from "@/context/useNotes";
import { useSession } from "@/lib/auth-client";

type NoteTypeSections = "Text" | "Link" | "Image"

export default function EditNotePage() {
    const router = useRouter();
    const params = useParams();
    const loader = useTopLoader();
    const noteId = params.noteId;

    const { notes, setNotes } = useNotes();
    const [title, setTitle] = useState("");
    const [type, setType] = useState<NoteTypeSections>("Text");
    const [noteTypes, setNoteTypes] = useState<NoteType | string[]>([])
    const [content, setContent] = useState("");
    const [url, setUrl] = useState("");
    const [tags, setTags] = useState("");
    const [imagePreview, setImagePreview] = useState<string | undefined | null>(undefined);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const { data: session, error, isPending, isRefetching, refetch } = useSession()

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        if (content.trim() !== "") {
            setNoteTypes(prev => {
                if (prev.includes("Text")) return prev;
                return [...prev, "Text"]
            })
        } else {
            setNoteTypes(prev => prev.filter(t => t !== "Text"))
        }
        if (url.trim() !== "") {
            setNoteTypes(prev => {
                if (prev.includes("Link")) return prev;
                return [...prev, "Link"]
            })
        } else {
            setNoteTypes(prev => prev.filter(t => t !== "Link"))
        }
        if (imagePreview !== undefined && imagePreview !== null) {
            setNoteTypes(prev => {
                if (prev.includes("Image")) return prev;
                return [...prev, "Image"]
            })
        } else {
            setNoteTypes(prev => prev.filter(t => t !== "Image"))
        }
    }, [content, url, imagePreview])

    useEffect(() => {


        let mounted = true;

        notes?.filter(note => note.id === noteId).map(note => {
            if (mounted) {
                setTitle(note.title);
                setContent(note.content ?? "");
                setTags(note.tags?.join(",") || "");
                setImagePreview(note.imageUrl);
            }
        });

        return () => {
            mounted = false;
        }
    }, [noteId]);

    const handleUpdate = async () => {

        loader.start();
        setIsUpdating(true);

        const res = await fetch(`/api/notes/update-note`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title,
                type: noteTypes,
                content,
                url,
                tags: tags.split(",").map((tag) => tag.trim()),
                imageUrl: imagePreview,
                noteId,
                date: new Date().toString(),
                userId: session?.user?.id
            })
        });


        if (res.ok) {

            const data = await res.json();
            setNotes(prev => {

                if (!prev) return [data.note]
                return (
                    prev.map(note => note.id === noteId ? data.note : note)
                )
            })

        }

        setIsUpdating(false);

        loader.done()

        router.push("/");
        router.refresh();
    };

    return (
        <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-background text-foreground scrollbar-none w-full relative selection:bg-blue-200 dark:selection:bg-blue-900">
            {/* Minimal Header */}
            <div className="sticky top-0 z-10 w-full px-4 py-3 bg-background/90 backdrop-blur-md flex items-center justify-between transition-all opacity-100 border-b border-border/50">
                <button
                    onClick={() => router.back()}
                    className="flex flex-row items-center space-x-2 p-2 px-3 rounded-lg hover:bg-accent hover:text-foreground text-muted-foreground font-medium transition-colors cursor-pointer text-sm"
                    title="Back"
                >
                    <ArrowLeft size={16} />
                    <span>Back</span>
                </button>

                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => router.back()}
                        className="px-4 py-1.5 text-muted-foreground hover:text-foreground font-semibold transition-colors cursor-pointer text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleUpdate}
                        disabled={isUpdating}
                        className="flex items-center space-x-2 px-4 py-1.5 bg-foreground text-background hover:scale-105 active:scale-95 rounded-lg font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                        <Save size={16} />
                        <span>Update Note</span>
                    </button>
                </div>
            </div>

            {/* Document Body */}
            <div className="flex-1 w-full max-w-[900px] xl:max-w-[1000px] mx-auto px-4 sm:px-8 md:px-16 py-8 md:py-12 pb-32">

                {/* Title Input */}
                <textarea
                    rows={1}
                    placeholder="Untitled Note"
                    value={title}
                    onChange={(e) => {
                        setTitle(e.target.value);
                        e.target.style.height = 'auto';
                        e.target.style.height = e.target.scrollHeight + 'px';
                    }}
                    className="w-full text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-8 md:mb-10 leading-tight wrap-break-word font-serif bg-transparent border-none outline-none placeholder:text-muted-foreground/30 focus:ring-0 resize-none overflow-hidden"
                />

                {/* Properties Table style for Tags */}
                <div className="flex flex-col gap-4 mb-10 md:mb-14 py-4 md:py-6 border-y border-border/40 text-[14px] sm:text-[15px]">
                    <div className="grid grid-cols-[80px_1fr] sm:grid-cols-[120px_1fr] items-center gap-2 sm:gap-4">
                        <div className="flex items-center gap-2 text-muted-foreground font-medium">
                            <Tag size={16} />
                            <span>Tags</span>
                        </div>
                        <input
                            type="text"
                            placeholder="e.g. design, specific details..."
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            className="w-full bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground/50 focus:ring-0 font-medium px-0"
                        />
                    </div>
                </div>

                {/* Type Selector (Block Styles Tabs) */}
                <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-border/40 pb-4">
                    {(["Text", "Link", "Image"] as NoteTypeSections[]).map((t) => (
                        <button
                            key={t}
                            onClick={() => setType(t)}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${type === t
                                ? "bg-accent/80 text-foreground shadow-sm border border-border/50"
                                : "text-muted-foreground hover:text-foreground hover:bg-accent/40"
                                }`}
                        >
                            {t === "Text" && <FileText size={16} />}
                            {t === "Link" && <LinkIcon size={16} />}
                            {t === "Image" && <ImageIcon size={16} />}
                            <span>{t}</span>
                        </button>
                    ))}
                </div>

                {/* Dynamic Content Area */}
                <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
                    {type === "Text" && (
                        <div className="prose prose-zinc dark:prose-invert prose-lg xl:prose-xl max-w-none prose-p:leading-relaxed w-full">
                            <textarea
                                placeholder="Start writing something epic..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full min-h-[300px] bg-transparent border-none focus:outline-none focus:ring-0 resize-y transition-all placeholder:text-muted-foreground/40 text-foreground/90 font-medium"
                            />
                        </div>
                    )}

                    {type === "Link" && (
                        <div className="space-y-4 max-w-2xl">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <LinkIcon size={18} className="text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
                                </div>
                                <input
                                    type="url"
                                    placeholder="https://..."
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-accent/5 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all font-medium hover:bg-accent/10 text-lg"
                                />
                            </div>
                            {url && (
                                <div className="p-4 bg-accent/5 border border-border/50 rounded-xl flex items-center space-x-4 animate-in fade-in slide-in-from-top-2">
                                    <div className="w-12 h-12 bg-background rounded-xl flex items-center justify-center border border-border/50 shrink-0">
                                        <LinkIcon size={20} className="text-blue-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground line-clamp-1 break-all">{url}</h4>
                                        <p className="text-sm text-muted-foreground mt-1">If available, a rich preview will be fetched seamlessly.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {type === "Image" && (
                        <div className="w-full relative max-w-3xl">
                            {!imagePreview ? (
                                <label className="w-full h-80 flex flex-col items-center justify-center border-2 border-dashed border-border/60 rounded-2xl bg-accent/5 hover:bg-accent/10 hover:border-blue-500/50 transition-all cursor-pointer group">
                                    <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm border border-border/50 group-hover:border-blue-500/30">
                                        <Upload size={24} className="text-muted-foreground group-hover:text-blue-500 transition-colors" />
                                    </div>
                                    <span className="font-bold text-foreground text-xl">Click anywhere to browse</span>
                                    <span className="text-sm text-muted-foreground mt-2 font-medium">SVG, PNG, JPG or GIF (max. 5MB)</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                </label>
                            ) : (
                                <div className="relative group rounded-2xl overflow-hidden border border-border/50 bg-accent/5 p-2">
                                    <img src={imagePreview} alt="Preview" className="w-full h-auto max-h-[600px] object-contain rounded-xl" />
                                    <div className="absolute inset-0 bg-background/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm rounded-2xl">
                                        <label className="px-6 py-3 bg-foreground text-background font-bold rounded-full cursor-pointer hover:scale-105 active:scale-95 transition-all flex items-center space-x-2 shadow-lg">
                                            <Upload size={18} />
                                            <span>Change Photo</span>
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}