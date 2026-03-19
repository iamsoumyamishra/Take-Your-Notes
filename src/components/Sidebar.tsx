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
    Trash2,
    MoreHorizontal,
    X,
    LogOut
} from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Sidebar() {
    const [isExpanded, setIsExpanded] = useState(true);
    const [mounted, setMounted] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { theme, setTheme } = useTheme();
    const router = useRouter()

    const { data: session, isPending, error, refetch } = authClient.useSession()

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
    
    // Items that will appear in the "More" menu on mobile
    const mobileMoreItems = navItems.filter(item => item.label !== "Dashboard" && item.label !== "Create New");

    const handleSignOut = async () => {
        await authClient.signOut()
        router.push("/sign-in")
    }

    return (
        <>
            {/* Desktop Sidebar (Hidden on mobile) */}
            <aside
                className={`hidden md:flex relative flex-col h-screen bg-sidebar shadow-[0_0_40px_rgba(0,0,0,0.05)] border-r border-sidebar-border transition-all duration-300 ease-in-out backdrop-blur-2xl z-40 ${isExpanded ? "w-72" : "w-20"
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
                <div className={`p-6 flex items-center transition-all duration-300 ${isExpanded ? "space-x-4" : "justify-center px-0"}`}>
                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-accent-foreground flex items-center justify-center shadow-lg shadow-primary/30 shrink-0 relative overflow-hidden group">
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
                            <div className="absolute inset-0 bg-linear-to-r from-primary/0 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity w-full" />
                            <item.icon size={20} className={`shrink-0 transition-transform duration-200 relative z-10 ${item.label === 'Create New' ? 'text-primary' : 'group-hover:scale-110'}`} />
                            {isExpanded && <span className={`font-medium whitespace-nowrap relative z-10 ${item.label === 'Create New' ? 'text-primary font-bold' : ''}`}>{item.label}</span>}
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
                            {mounted && (
                                theme === "dark" ? (
                                    <Sun size={20} className="shrink-0 group-hover:rotate-45 group-hover:text-amber-400 transition-all duration-300" />
                                ) : (
                                    <Moon size={20} className="shrink-0 group-hover:-rotate-12 group-hover:text-indigo-600 transition-all duration-300" />
                                )
                            )}
                        </div>
                        {isExpanded && <span className="font-medium whitespace-nowrap">Toggle Theme</span>}
                    </button>

                    {/* User Profile Snippet */}
                    <div className={`mt-4 flex items-center ${isExpanded ? 'space-x-3 px-2' : 'justify-center'} cursor-pointer group`} onClick={handleSignOut}>
                        <div className="w-9 h-9 rounded-full bg-sidebar-accent flex items-center justify-center shrink-0 border border-sidebar-border overflow-hidden">
                            {
                                session?.user?.image ?
                                    <Image src={session?.user?.image || ""} alt={session?.user?.name || ""} width={36} height={36} className="rounded-full" />
                                    : <User size={16} className="text-sidebar-foreground group-hover:scale-110 transition-transform" />
                            }
                        </div>
                        {isExpanded && (
                            <div className="flex flex-col min-w-0">
                                <span className="text-sm font-semibold text-foreground truncate">{session?.user?.name || 'User'}</span>
                                <span className="text-xs text-sidebar-foreground truncate">{session?.user?.email}</span>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Mobile Bottom Navigation (Visible only on mobile) */}
            <div className="md:hidden fixed bottom-0 left-0 w-full z-50">
                
                {/* Mobile More Options Overlay */}
                <div 
                    className={`absolute bottom-[64px] left-0 w-full bg-sidebar border-t border-sidebar-border p-4 shadow-xl transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full pointer-events-none'}`}
                >
                    <div className="flex items-center justify-between mb-4 mt-2">
                        <span className="font-bold text-lg text-foreground px-2">More Options</span>
                        <button onClick={() => setMobileMenuOpen(false)} className="p-1 rounded-full bg-accent/50 text-muted-foreground hover:text-foreground">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                        {mobileMoreItems.map((item, idx) => (
                            <Link key={idx} href={item.href} onClick={() => setMobileMenuOpen(false)} className="flex flex-col items-center justify-center p-3 rounded-xl bg-accent/30 hover:bg-accent/50 gap-2">
                                <item.icon size={22} className="text-foreground/80" />
                                <span className="text-[11px] font-medium text-foreground/80 tracking-wide">{item.label}</span>
                            </Link>
                        ))}
                        
                        <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="flex flex-col items-center justify-center p-3 rounded-xl bg-accent/30 hover:bg-accent/50 gap-2">
                            {mounted && (theme === "dark" ? <Sun size={22} className="text-amber-400" /> : <Moon size={22} className="text-indigo-600" />)}
                            <span className="text-[11px] font-medium text-foreground/80 tracking-wide">Theme</span>
                        </button>
                        
                        <button onClick={handleSignOut} className="flex flex-col items-center justify-center p-3 rounded-xl bg-accent/30 hover:bg-red-500/10 gap-2 group text-foreground/80 hover:text-red-500">
                            <LogOut size={22} className="group-hover:text-red-500 text-red-500" />
                            <span className="text-[11px] font-medium group-hover:text-red-500 text-red-500 tracking-wide">Logout</span>
                        </button>
                    </div>
                </div>

                {/* Main 3 Segment Bottom Bar */}
                <div className="flex flex-row items-center justify-around h-16 bg-background/95 backdrop-blur-3xl border-t border-border/50 px-2 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.03)] relative z-10 w-full">
                    
                    {/* 1. Dashboard Segment */}
                    <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex flex-col items-center space-y-1 p-2 w-1/3 text-muted-foreground hover:text-foreground">
                        <LayoutDashboard size={24} />
                        <span className="text-[10px] items-center font-bold tracking-wide">Dashboard</span>
                    </Link>
                    
                    {/* 2. Create Segment (Elevated Center Button) */}
                    <div className="w-1/3 flex justify-center h-full relative">
                        <Link 
                            href="/notes/new" 
                            onClick={() => setMobileMenuOpen(false)} 
                            className="absolute -top-5 flex items-center justify-center w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all ring-4 ring-background"
                        >
                            <PlusCircle size={28} />
                        </Link>
                    </div>
                    
                    {/* 3. More Segment */}
                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="flex flex-col items-center space-y-1 p-2 w-1/3 text-muted-foreground hover:text-foreground">
                        <MoreHorizontal size={24} className={mobileMenuOpen ? 'text-primary' : ''} />
                        <span className={`text-[10px] items-center font-bold tracking-wide ${mobileMenuOpen ? 'text-primary' : ''}`}>More</span>
                    </button>
                    
                </div>
            </div>
        </>
    );
}
