"use client";

import React, { useState } from "react";
import { Search, Filter, ChevronDown } from "lucide-react";
import Card from "@/components/Card";
import { INote } from "@/types";

// Dummy Notes Data
const DUMMY_NOTES: INote[] = [
  {
    id: "1",
    title: "10 CSS Tricks for Next.js",
    type: ["Link"],
    content: "A great article on how to master CSS in modern Next.js apps using Tailwind and CSS modules...",
    date: "Oct 12, 2023",
    url: "https://example.com/css-tricks"
  },
  {
    id: "2",
    title: "Project Architecture Diagram",
    type: ["Image"],
    content: "Visual representation of the new microservices architecture we are planning to adopt in Q4.",
    imageUrl: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=600&auto=format&fit=crop",
    date: "Oct 14, 2023",
  },
  {
    id: "3",
    title: "Meeting Notes: Q4 Planning",
    type: ["Text"],
    content: "Discussed upcoming roadmap specifically around performance improvements and database restructuring. Action items: 1. Optimize images 2. Review indexing.",
    date: "Oct 15, 2023",
  },
  {
    id: "4",
    title: "Figma Inspiration Board",
    type: ["Link"],
    content: "Collection of references for the new landing page UI.",
    date: "Oct 18, 2023",
    url: "https://figma.com/file/xyz123"
  },
  {
    id: "5",
    title: "Random Ideas",
    type: ["Text"],
    content: "Write a blog post about how artificial intelligence is shaping modern personal knowledge management.",
    date: "Oct 20, 2023",
  },
  {
    id: "6",
    title: "Vacation Photos",
    type: ["Image"],
    content: "Trip to the mountains, remember to edit these later.",
    imageUrl: "https://images.unsplash.com/photo-1506744626753-dba37c259d1b?q=80&w=600&auto=format&fit=crop",
    date: "Oct 22, 2023",
  },
];

type Filter = "All" | "Text" | "Link" | "Image" | "Video" | "Audio" | "File" | "Other"


export default function DashboardPage() {
  const [filter, setFilter] = useState<Filter>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNotes = DUMMY_NOTES.filter((note) => {
    const matchesFilter = filter === "All" || note.type.includes(filter);
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex-1 p-8 h-screen overflow-y-auto bg-background text-foreground scrollbar-none">
      {/* Top Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-violet-500 to-fuchsia-600">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">
            Manage and organize your notes seamlessly.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Bar */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-muted-foreground group-focus-within:text-violet-500 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-accent/30 hover:bg-accent/50 border border-border rounded-xl w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all shadow-sm backdrop-blur-sm"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative group">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as Filter)}
              className="appearance-none pl-10 pr-10 py-2.5 bg-accent/30 hover:bg-accent/50 border border-border rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all shadow-sm font-medium backdrop-blur-sm"
            >
              <option value="All">All Types</option>
              <option value="Link">Links</option>
              <option value="Image">Images</option>
              <option value="Text">Text</option>
            </select>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter size={16} className="text-muted-foreground group-hover:text-violet-500 transition-colors" />
            </div>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ChevronDown size={16} className="text-muted-foreground group-hover:text-violet-500 transition-colors" />
            </div>
          </div>
        </div>
      </header>

      {/* Grid Layout of Notes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-24">
        {filteredNotes.map((note) => (
          <Card key={note.id} note={note} />
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-4">
            <Search size={24} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bold text-foreground">No notes found</h3>
          <p className="text-muted-foreground mt-1">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}