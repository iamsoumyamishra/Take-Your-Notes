"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft, Image as ImageIcon, Link as LinkIcon, FileText, Upload, Save, Tag } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { NoteType } from "@/types";

type NoteTypeSections = "Text" | "Link" | "Image"

export default function EditNotePage() {
    const router = useRouter();
    const params = useParams();
    const noteId = params.noteId;

    const [title, setTitle] = useState("");
    const [type, setType] = useState<NoteTypeSections>("Text");
    const [noteTypes, setNoteTypes] = useState<NoteType | string[]>([])
    const [content, setContent] = useState("");
    const [url, setUrl] = useState("");
    const [tags, setTags] = useState("");
    const [imagePreview, setImagePreview] = useState<string | null>(null);

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
        if (imagePreview !== null) {
            setNoteTypes(prev => {
                if (prev.includes("Image")) return prev;
                return [...prev, "Image"]
            })
        } else {
            setNoteTypes(prev => prev.filter(t => t !== "Image"))
        }
    }, [content, url, imagePreview])

    useEffect(() => {

        const fetchNote = async () => {
            const res = await fetch(`/api/notes/get-notes`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        noteId
                    })
                }
            );
            const data = await res.json();

            return data;
        }

        let mounted = true;

        fetchNote().then(data => {
            if (mounted) {
                setTitle(data.notes[0].title);
                setContent(data.notes[0].content);
                // setType(data.notes[0].type);
                setTags(data.notes[0].tags.join(","));
            }
        });

        // if (noteId) {
        //     // Dummy Data fetch for editing
        //     console.log(`Fetching Note ${noteId} for Editing`);
        //     setTitle("Previously saved note");
        //     setContent("This content was fetched from the backend and prefilled.");
        //     setType("Text");
        //     setTags("updated, references");
        // }

        return () => {
            mounted = false;
        }
    }, [noteId]);

    const handleUpdate = async () => {
        // Update logic later
        console.log("Updating:", { noteId, title, type, content, url, tags, imagePreview });

        // Dummy Network Save Operation
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
                date: new Date().toString()
            })
        });

        router.push("/");
        router.refresh();
    };

    return (
        <div className="flex-1 p-4 md:p-8 h-screen overflow-y-auto bg-background text-foreground scrollbar-none w-full">
            <div className="max-w-4xl mx-auto pb-24">
                {/* Header */}
                <div className="flex items-center space-x-4 mb-8">
                    <button
                        onClick={() => router.back()}
                        className="p-2 rounded-full hover:bg-accent hover:text-foreground text-muted-foreground transition-colors border border-transparent hover:border-border"
                        title="Go back"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-primary to-accent-foreground">
                            Edit Note
                        </h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            Update your ideas, links, or images seamlessly.
                        </p>
                    </div>
                </div>

                {/* Main Form Area */}
                <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm">
                    {/* Title Input */}
                    <div className="mb-8">
                        <input
                            type="text"
                            placeholder="Note Title..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full text-3xl md:text-4xl font-bold bg-transparent border-none outline-none placeholder:text-muted-foreground/50 focus:ring-0"
                        />
                    </div>

                    {/* Type Selector */}
                    <div className="flex flex-wrap items-center gap-3 mb-8 p-1.5 bg-accent/30 rounded-2xl w-fit border border-border/50">
                        {(["Text", "Link", "Image"] as NoteTypeSections[]).map((t) => (
                            <button
                                key={t}
                                onClick={() => setType(t)}
                                className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${type === t
                                    ? "bg-background text-foreground shadow-sm ring-1 ring-border"
                                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
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
                    <div className="mb-8 min-h-[200px] animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {type === "Text" && (
                            <textarea
                                placeholder="Start writing your note here..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full min-h-[300px] p-5 bg-accent/10 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y transition-all placeholder:text-muted-foreground text-base leading-relaxed hover:bg-accent/20"
                            />
                        )}

                        {type === "Link" && (
                            <div className="space-y-4">
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <LinkIcon size={18} className="text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    </div>
                                    <input
                                        type="url"
                                        placeholder="https://example.com"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3.5 bg-accent/10 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium hover:bg-accent/20"
                                    />
                                </div>
                                {url && (
                                    <div className="p-4 bg-accent/10 border border-border rounded-2xl flex items-center space-x-4 animate-in fade-in slide-in-from-top-2">
                                        <div className="w-12 h-12 bg-background rounded-xl flex items-center justify-center border border-border shrink-0">
                                            <LinkIcon size={20} className="text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-foreground line-clamp-1">{url}</h4>
                                            <p className="text-xs text-muted-foreground mt-1">If available, a rich preview will be fetched upon saving.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {type === "Image" && (
                            <div className="w-full relative">
                                {!imagePreview ? (
                                    <label className="w-full h-64 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-2xl bg-accent/5 hover:bg-accent/20 hover:border-primary/50 transition-all cursor-pointer group">
                                        <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm border border-border group-hover:border-primary/30">
                                            <Upload size={24} className="text-muted-foreground group-hover:text-primary transition-colors" />
                                        </div>
                                        <span className="font-semibold text-foreground text-lg">Click to upload image</span>
                                        <span className="text-sm text-muted-foreground mt-2">SVG, PNG, JPG or GIF (max. 5MB)</span>
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                    </label>
                                ) : (
                                    <div className="relative group rounded-2xl overflow-hidden border border-border bg-accent/5">
                                        <img src={imagePreview} alt="Preview" className="w-full h-auto max-h-[500px] object-contain" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                            <label className="px-6 py-2.5 bg-white text-black font-semibold rounded-full cursor-pointer hover:scale-105 transition-transform flex items-center space-x-2">
                                                <Upload size={18} />
                                                <span>Change Image</span>
                                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                            </label>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Tags */}
                    <div className="mb-10">
                        <div className="flex items-center space-x-2 text-sm font-semibold text-muted-foreground mb-3 px-1">
                            <Tag size={16} />
                            <span>Tags</span>
                        </div>
                        <input
                            type="text"
                            placeholder="e.g., design, references, todo (comma separated)"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            className="w-full px-4 py-3.5 bg-accent/10 hover:bg-accent/20 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                    </div>

                    {/* Action Footer */}
                    <div className="flex items-center justify-end border-t border-border pt-6">
                        <button
                            onClick={() => router.back()}
                            className="px-6 py-2.5 text-muted-foreground hover:text-foreground font-semibold transition-colors mr-4 cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleUpdate}
                            className="flex items-center space-x-2 px-6 py-2.5 bg-foreground text-background hover:scale-105 active:scale-95 rounded-xl font-bold transition-all shadow-lg cursor-pointer"
                        >
                            <Save size={18} />
                            <span>Update Note</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}