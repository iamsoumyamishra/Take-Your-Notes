import React from 'react'

const Spinner = ({ message }: { message: string }) => {
    return (
        <div className="flex-1 p-8 overflow-y-auto w-full bg-background flex items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
                <div className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
                <p className="text-muted-foreground font-medium animate-pulse">{message}</p>
            </div>
        </div>
    )
}

export default Spinner