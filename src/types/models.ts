type NoteType = ("Text" | "Link" | "Image" | "Video" | "Audio" | "File" | "Other")[];

interface INote {
    id: string;
    title: string;
    type: NoteType;
    content?: string;
    date: string;
    url?: string;
    imageUrl?: string;
    tags?: string[];
}

export type { NoteType, INote };