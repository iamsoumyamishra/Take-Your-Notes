"use client"
import { INotes } from '@/types'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const NotePage = () => {


    const temp = [
        {
            id: 1,
            title: "Note 1",
            content: "This is the first note.",
            createdAt: "2026-01-24",
            updatedAt: "2026-01-24",
            pinned: false
        },
        {
            id: 2,
            title: "Note 2",
            content: "This is the second note.",
            createdAt: "2026-01-24",
            updatedAt: "2026-01-24",
            pinned: true
        },
        {
            id: 3,
            title: "Note 3",
            content: "Additional details go here.",
            createdAt: "2026-01-24",
            updatedAt: "2026-01-24",
            pinned: false
        }
    ]
    const [notes, setNotes] = useState<INotes[]>([])
    const params = useParams()
    const router = useRouter()


    return (
        <div>NotePage</div>
    )
}

export default NotePage