"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { signIn } from "@/lib/auth-client";

function LoginForm() {
    const searchParams = useSearchParams();
    const redirectUri = searchParams.get("redirect_uri") || undefined;

    const handleSignIn = async (provider: "github" | "google") => {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://api.afkmate.in";
        // After OAuth, BetterAuth redirects to callback-bridge which extracts the
        // session token and forwards to the vscode:// URI (or /dashboard for browsers).
        const callbackURL = redirectUri
            ? `${backendUrl}/api/auth/callback-bridge?redirect_uri=${encodeURIComponent(redirectUri)}`
            : "/dashboard";

        await signIn.social({ provider, callbackURL });
    };

    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0a", color: "#fff", fontFamily: "system-ui, -apple-system, sans-serif" }}>
            <div style={{ maxWidth: 400, width: "100%", padding: 40, borderRadius: 12, border: "1px solid #1e1e1e", background: "#111" }}>
                <div style={{ marginBottom: 32, textAlign: "center" }}>
                    <img src="/images/logo.svg" alt="AFKmate" style={{ height: 36, marginBottom: 12 }} />
                    <h1 style={{ fontSize: 22, fontWeight: 600, margin: "0 0 6px" }}>Sign in to AFKmate</h1>
                    <p style={{ color: "#666", fontSize: 14, margin: 0 }}>
                        {redirectUri ? "Signing in from VS Code extension" : "Access your account and usage"}
                    </p>
                </div>

                <button
                    onClick={() => handleSignIn("github")}
                    style={{ width: "100%", padding: "11px 16px", marginBottom: 10, borderRadius: 8, border: "1px solid #2a2a2a", background: "#1a1a1a", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, transition: "border-color 0.15s" }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    Continue with GitHub
                </button>

                <button
                    onClick={() => handleSignIn("google")}
                    style={{ width: "100%", padding: "11px 16px", borderRadius: 8, border: "1px solid #2a2a2a", background: "#1a1a1a", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                </button>

                <p style={{ color: "#444", fontSize: 12, textAlign: "center", marginTop: 24, lineHeight: 1.5 }}>
                    By signing in, you agree to our{" "}
                    <a href="/terms" style={{ color: "#666" }}>Terms</a> and{" "}
                    <a href="/privacy" style={{ color: "#666" }}>Privacy Policy</a>.
                </p>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div style={{ minHeight: "100vh", background: "#0a0a0a" }} />}>
            <LoginForm />
        </Suspense>
    );
}
