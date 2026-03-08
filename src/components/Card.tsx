import { LinkIcon, ImageIcon, FileText, ExternalLink, Calendar } from 'lucide-react'
import { INote } from '@/types';
import NoteOptions from './NoteOptions';
import { useNotes } from '@/context/useNotes';
import { useRouter } from 'nextjs-toploader/app';


const Card = ({ note }: { note: INote }) => {

    const { notes, setNotes } = useNotes()
    const router = useRouter();

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "Link":
                return <LinkIcon size={14} className="text-blue-500" />;
            case "Image":
                return <ImageIcon size={14} className="text-purple-500" />;
            default:
                return <FileText size={14} className="text-emerald-500" />;
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
    return (

        <div
            key={note.id}
            onClick={() => router.push(`/notes/${note.id}`)}
            className="group flex flex-col bg-card hover:bg-accent/20 border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full"
        >
            {/* Image Thumbnail (if Image Type) */}
            {note.type.includes("Image") && note.imageUrl && (
                <div className="w-full h-40 overflow-hidden relative border-b border-border">
                    <img
                        src={note.imageUrl}
                        alt={note.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                </div>
            )}

            <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-3 gap-2">
                    <div className='flex flex-wrap gap-2'>
                        {/* Type Badge */}
                        {
                            note.type.map((t) =>
                                <span
                                    key={t}
                                    className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${getTypeColor(
                                        t
                                    )}`}
                                >
                                    {getTypeIcon(t)}
                                    <span>{t}</span>
                                </span>
                            )}
                    </div>

                    <NoteOptions
                        onEdit={() => router.push(`/notes/edit/${note.id}`)}
                        onDelete={async () => {
                            await fetch("/api/notes/delete-note", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({ noteId: note.id }),
                            });

                            setNotes(notes && notes.filter((n) => n.id !== note.id))
                        }}
                        onExport={() => console.log("Export note", note.id)}
                    />
                </div>

                {/* Title & Content */}
                <h3 className="font-bold text-lg text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                    {note.title}
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">
                    {note.content}
                </p>

                {/* Specific Type Extras (Link URL) */}
                {note.type.includes("Link") && note.url && (
                    <div className="flex items-center space-x-2 text-xs text-blue-500 mb-4 bg-blue-500/5 p-2 rounded-lg truncate">
                        <ExternalLink size={14} className="shrink-0" />
                        <span className="truncate"><a href={note.url} target='_blank'>{note.url}</a></span>
                    </div>
                )}

                {/* Footer Date */}
                <div className="mt-auto pt-4 border-t border-border flex items-center text-xs text-muted-foreground">
                    <Calendar size={14} className="mr-1.5" />
                    {new Date(note.date).toDateString()}
                </div>
            </div>
        </div>

    )
}

export default Card