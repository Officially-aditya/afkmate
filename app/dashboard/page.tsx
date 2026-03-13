"use client";

import { useSession, signOut } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Quota {
    limit: number;
    used: number;
    remaining: number;
}

interface Me {
    id: string;
    name: string;
    email: string;
    image?: string;
    tier: "free" | "premium" | "premium_plus";
    quota: Quota;
}

export default function DashboardPage() {
    const { data: session, isPending } = useSession();
    const router = useRouter();
    const [me, setMe] = useState<Me | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://api.afkmate.in";

    useEffect(() => {
        if (!isPending && !session) {
            router.replace("/login");
        }
    }, [session, isPending, router]);

    useEffect(() => {
        if (!session) return;

        const token = (session as { session?: { token?: string } })?.session?.token;
        if (!token) return;

        fetch(`${backendUrl}/api/me`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((r) => r.json())
            .then((data) => setMe(data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [session, backendUrl]);

    if (isPending || loading) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0a", color: "#888" }}>
                Loading...
            </div>
        );
    }

    if (!session || !me) return error ? <div style={{ color: "red", padding: 20 }}>Error: {error}</div> : null;

    const { tier, quota } = me;
    const isPremium = tier === "premium" || tier === "premium_plus";
    const usedPct = quota.limit > 0 ? Math.min((quota.used / quota.limit) * 100, 100) : 0;

    const handleSignOut = async () => {
        await signOut({ fetchOptions: { onSuccess: () => router.replace("/") } });
    };

    return (
        <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "system-ui, -apple-system, sans-serif", padding: "40px 20px" }}>
            <div style={{ maxWidth: 640, margin: "0 auto" }}>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 40 }}>
                    <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
                        <img src="/images/logo.svg" alt="AFKmate" style={{ height: 28 }} />
                    </a>
                    <button
                        onClick={handleSignOut}
                        style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid #2a2a2a", background: "transparent", color: "#666", cursor: "pointer", fontSize: 13 }}
                    >
                        Sign out
                    </button>
                </div>

                {/* User card */}
                <div style={{ padding: 24, borderRadius: 12, border: "1px solid #1e1e1e", background: "#111", marginBottom: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                        {me.image && (
                            <img src={me.image} alt={me.name} style={{ width: 48, height: 48, borderRadius: "50%", border: "2px solid #2a2a2a" }} />
                        )}
                        <div>
                            <div style={{ fontWeight: 600, fontSize: 16 }}>{me.name}</div>
                            <div style={{ color: "#666", fontSize: 13 }}>{me.email}</div>
                        </div>
                        <div style={{ marginLeft: "auto", padding: "4px 10px", borderRadius: 20, background: isPremium ? "#1a1a3a" : "#1a1a1a", border: `1px solid ${isPremium ? "#4444aa" : "#2a2a2a"}`, color: isPremium ? "#aaaaff" : "#888", fontSize: 12, fontWeight: 600 }}>
                            {tier === "premium_plus" ? "Premium Plus" : tier === "premium" ? "Premium" : "Free"}
                        </div>
                    </div>

                    {/* Quota */}
                    <div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13 }}>
                            <span style={{ color: "#888" }}>Analyses this month</span>
                            <span style={{ color: "#ccc" }}>
                                {isPremium ? "Unlimited" : `${quota.used} / ${quota.limit}`}
                            </span>
                        </div>
                        {!isPremium && (
                            <div style={{ height: 4, borderRadius: 2, background: "#1e1e1e", overflow: "hidden" }}>
                                <div style={{ height: "100%", width: `${usedPct}%`, background: usedPct > 80 ? "#e05050" : "#5050e0", borderRadius: 2, transition: "width 0.3s" }} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Upgrade CTA for free users */}
                {!isPremium && (
                    <div style={{ padding: 24, borderRadius: 12, border: "1px solid #2a2020", background: "#130e0e", textAlign: "center" }}>
                        <div style={{ fontWeight: 600, marginBottom: 8 }}>Upgrade Your Plan</div>
                        <p style={{ color: "#888", fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>
                            Free includes 20 analyses/month on Claude Haiku 4.5. Premium gives you Claude Sonnet 4 with 60 analyses/month for $10. Premium Plus gives you Claude Sonnet 4 with unlimited analyses for $49.
                        </p>
                        <a
                            href="/premium"
                            style={{ display: "inline-block", padding: "10px 24px", borderRadius: 8, background: "#5050e0", color: "#fff", textDecoration: "none", fontSize: 14, fontWeight: 500 }}
                        >
                            View Premium Plans
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
