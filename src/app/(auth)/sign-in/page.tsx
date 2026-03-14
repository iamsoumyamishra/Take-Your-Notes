"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SigninPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSignin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const { data, error } = await authClient.signIn.email({
            email,
            password,
            callbackURL: "/"
        }, {
            onRequest: () => {
                setIsLoading(true);
            },
            onSuccess: () => {
                router.push("/");
            },
            onError: (ctx) => {
                setError(ctx.error.message);
                setIsLoading(false);
            }
        });
    };

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        await authClient.signIn.social({ provider: "google", callbackURL: "/" });
    };

    return (
        <div className="w-full max-w-md mx-auto min-h-[85vh] flex flex-col justify-center relative z-10 my-auto">
            {/* Background glowing effects for premium feel */}
            <div className="absolute top-1/4 -left-12 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -z-10 animate-pulse duration-1000" />
            <div className="absolute bottom-1/4 -right-12 w-64 h-64 bg-accent-foreground/10 rounded-full blur-[80px] -z-10 animate-pulse duration-3000" />

            <div className="w-full bg-sidebar/80 backdrop-blur-xl border border-sidebar-border shadow-2xl shadow-primary/5 rounded-4xl p-8 md:p-10 flex flex-col gap-6 relative overflow-hidden">
                {/* Decorative top border */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-primary via-accent-foreground to-primary" />

                <div className="flex flex-col gap-2 text-center mt-2">
                    <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                        Welcome back
                    </h1>
                    <p className="text-sm font-medium text-muted-foreground mt-1">
                        Sign in to NoteFlow to continue organizing your thoughts.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm font-medium text-center animate-in fade-in zoom-in duration-300">
                        {error}
                    </div>
                )}

                <div className="flex flex-col gap-4">
                    <button
                        onClick={handleGoogleSignIn}
                        type="button"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 bg-background/50 border border-border hover:bg-muted text-foreground py-3 rounded-2xl font-semibold transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
                    >
                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Continue with Google
                    </button>

                    <div className="relative flex items-center py-2">
                        <div className="grow border-t border-border"></div>
                        <span className="shrink-0 mx-4 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Or with email</span>
                        <div className="grow border-t border-border"></div>
                    </div>
                </div>

                <form onSubmit={handleSignin} className="flex flex-col gap-5 text-left">
                    <div className="space-y-4">
                        <div className="group relative">
                            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block group-focus-within:text-primary transition-colors">
                                Email Address
                            </label>
                            <div className="relative flex items-center">
                                <Mail className="absolute left-3.5 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-background/50 border border-input text-foreground rounded-2xl pl-11 pr-4 py-3.5 outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-300 font-medium"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div className="group relative">
                            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block group-focus-within:text-primary transition-colors">
                                Password
                            </label>
                            <div className="relative flex items-center">
                                <Lock className="absolute left-3.5 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-background/50 border border-input text-foreground rounded-2xl pl-11 pr-4 py-3.5 outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-300 font-medium"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="group relative w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/95 text-primary-foreground py-4 rounded-2xl font-bold text-base transition-all duration-300 mt-2 hover:shadow-[0_0_20px_rgba(107,142,131,0.4)] disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden shadow-md cursor-pointer"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                Sign In
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                            </>
                        )}
                    </button>

                    <p className="text-sm text-center text-muted-foreground mt-4 font-medium">
                        Don't have an account?{" "}
                        <Link href="/sign-up" className="font-bold text-primary hover:text-primary/80 hover:underline transition-colors decoration-2 underline-offset-4 pointer-events-auto">
                            Sign up instead
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
