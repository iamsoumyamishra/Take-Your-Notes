"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import {
    LayoutDashboard,
    FileText,
    Settings,
    Sun,
    Moon,
    ChevronLeft,
    ChevronRight,
    User,
    Search,
    BookOpen,
    PlusCircle,
    Tag,
    Star,
    Trash2
} from "lucide-react";
import Link from "next/link";

export default function Sidebar() {
    const [isExpanded, setIsExpanded] = useState(true);
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    // Next-themes hydration mismatch fix
    useEffect(() => {
        setMounted(true);
    }, []);

    const navItems = [
        { icon: PlusCircle, label: "Create New", href: "/notes/new" },
        { icon: LayoutDashboard, label: "Dashboard", href: "/" },
        { icon: FileText, label: "All Notes", href: "#" },
        { icon: Tag, label: "Tags", href: "#" },
        { icon: Star, label: "Favorites", href: "#" },
        { icon: Trash2, label: "Trash", href: "#" },
        { icon: BookOpen, label: "Resources", href: "#" },
        { icon: User, label: "Profile", href: "#" },
        { icon: Settings, label: "Settings", href: "#" },
    ];

    return (
        <aside
            className={`relative flex flex-col h-screen bg-sidebar shadow-[0_0_40px_rgba(0,0,0,0.05)] border-r border-sidebar-border transition-all duration-300 ease-in-out backdrop-blur-2xl z-40 ${isExpanded ? "w-72" : "w-20"
                }`}
        >
            {/* Toggle Sidebar Button */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="absolute -right-3.5 top-8 flex items-center justify-center w-7 h-7 bg-background rounded-full border border-sidebar-border hover:scale-110 transition-transform z-50 text-sidebar-foreground shadow-md cursor-pointer"
                aria-label="Toggle Sidebar"
            >
                {isExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>

            {/* Logo Area */}
            <div className={`p-6 flex items-center transition-all duration-300 ${isExpanded ? "space-x-4" : "justify-center"}`}>
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/30 shrink-0 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500 ease-out skew-x-12 -ml-6" />
                    <BookOpen size={20} className="text-white relative z-10" />
                </div>
                {isExpanded && (
                    <span className="font-bold text-2xl tracking-tight bg-linear-to-br from-foreground to-foreground/70 bg-clip-text text-transparent whitespace-nowrap">
                        NoteFlow
                    </span>
                )}
            </div>

            {/* Search/Quick Action */}
            <div className="px-4 mb-6">
                <div className={`flex items-center space-x-3 bg-sidebar-accent/50 rounded-xl px-3 py-2.5 transition-all duration-300 hover:bg-sidebar-accent ${isExpanded ? "justify-start" : "justify-center cursor-pointer"}`}>
                    <Search size={18} className="text-sidebar-foreground shrink-0" />
                    {isExpanded && (
                        <input
                            type="text"
                            placeholder="Quick search..."
                            className="bg-transparent border-none outline-none text-sm w-full text-foreground placeholder:text-sidebar-foreground/70"
                        />
                    )}
                </div>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto w-full scrollbar-none">
                {navItems.map((item, idx) => (
                    <Link
                        key={idx}
                        href={item.href}
                        className={`flex items-center space-x-3.5 px-3 py-2.5 rounded-xl text-sidebar-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200 group relative overflow-hidden ${!isExpanded ? "justify-center" : ""}`}
                        title={!isExpanded ? item.label : undefined}
                    >
                        <div className="absolute inset-0 bg-linear-to-r from-violet-500/0 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <item.icon size={20} className="shrink-0 group-hover:scale-110 transition-transform duration-200 relative z-10" />
                        {isExpanded && <span className="font-medium whitespace-nowrap relative z-10">{item.label}</span>}
                    </Link>
                ))}
            </nav>

            {/* Theme Toggle & Footer Area */}
            <div className="p-4 mt-auto border-t border-sidebar-border">
                <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className={`flex items-center w-full space-x-3.5 px-3 py-2.5 rounded-xl text-sidebar-foreground hover:bg-sidebar-accent transition-all duration-200 group ${!isExpanded ? "justify-center" : ""}`}
                    title="Toggle theme"
                >
                    <div className="relative flex items-center justify-center">
                        {mounted ? (
                            theme === "dark" ? (
                                <Sun size={20} className="shrink-0 group-hover:rotate-45 group-hover:text-amber-400 transition-all duration-300" />
                            ) : (
                                <Moon size={20} className="shrink-0 group-hover:-rotate-12 group-hover:text-indigo-600 transition-all duration-300" />
                            )
                        ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-sidebar-border border-t-transparent animate-spin shrink-0" />
                        )}
                    </div>

                    {isExpanded && <span className="font-medium whitespace-nowrap">Toggle Theme</span>}
                </button>

                {/* User Profile Snippet */}
                <div className={`mt-4 flex items-center ${isExpanded ? 'space-x-3 px-2' : 'justify-center'} cursor-pointer group`}>
                    <div className="w-9 h-9 rounded-full bg-sidebar-accent flex items-center justify-center shrink-0 border border-sidebar-border overflow-hidden">
                        <User size={16} className="text-sidebar-foreground group-hover:scale-110 transition-transform" />
                    </div>
                    {isExpanded && (
                        <div className="flex flex-col min-w-0">
                            <span className="text-sm font-semibold text-foreground truncate">Alex Developer</span>
                            <span className="text-xs text-sidebar-foreground truncate">Pro Plan</span>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}
