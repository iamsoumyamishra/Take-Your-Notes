import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "next-themes";
import Sidebar from "@/components/Sidebar";
import { NotesProvider } from "@/context/useNotes";
import NextTopLoader from "nextjs-toploader";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NoteFlow",
  description: "Take Your Notes",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await auth.api.getSession({
    headers: await headers()
  })


  if (!session) {
    redirect("/sign-in")
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute={"class"} defaultTheme="system">
          <NotesProvider>
            <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
              <NextTopLoader
                color="#2299DD"
                initialPosition={0.08}
                crawlSpeed={200}
                height={3}
                crawl={true}
                showSpinner={false}
                easing="ease"
                speed={200}
                shadow="0 0 10px #2299DD,0 0 5px #2299DD"
                zIndex={1600}
                showAtBottom={false}
              />
              <Sidebar />
              {/* pb-16 accommodates the mobile bottom nav height so content isn't covered! */}
              <main className="flex-1 w-full relative h-screen overflow-hidden pb-16 md:pb-0">
                {children}
              </main>
            </div>
          </NotesProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
