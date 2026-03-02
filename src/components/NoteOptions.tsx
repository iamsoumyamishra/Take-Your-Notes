"use client";

import React, { useState, useRef, useEffect } from "react";
import { MoreVertical, Edit2, Trash2, Download } from "lucide-react";

interface NoteOptionsProps {
    onEdit?: () => void;
    onDelete?: () => void;
    onExport?: () => void;
}

export default function NoteOptions({ onEdit, onDelete, onExport }: NoteOptionsProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-accent focus:outline-none"
                aria-label="Note options"
            >
                <MoreVertical size={16} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-background border border-border rounded-xl shadow-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="py-1">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsOpen(false);
                                onEdit?.();
                            }}
                            className="w-full flex items-center space-x-2 px-4 py-2.5 text-sm text-foreground hover:bg-accent transition-colors"
                        >
                            <Edit2 size={14} className="text-blue-500" />
                            <span>Edit Note</span>
                        </button>

                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsOpen(false);
                                onExport?.();
                            }}
                            className="w-full flex items-center space-x-2 px-4 py-2.5 text-sm text-foreground hover:bg-accent transition-colors"
                        >
                            <Download size={14} className="text-emerald-500" />
                            <span>Export Data</span>
                        </button>

                        <div className="h-px bg-border my-1 mx-2" />

                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsOpen(false);
                                onDelete?.();
                            }}
                            className="w-full flex items-center space-x-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                        >
                            <Trash2 size={14} />
                            <span>Delete</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
