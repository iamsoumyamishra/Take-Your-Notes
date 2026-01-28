import { AppSidebar } from '@/components/Sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import React from 'react'


const UserLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='h-screen'>
            <SidebarProvider className='font-roboto'>
                <AppSidebar />
            <div className='main-content w-full'>
                {children}
            </div>
            </SidebarProvider>
        </div>
    )
}

export default UserLayout