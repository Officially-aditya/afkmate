import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "AFKmate - Your AI Coding Companion",
    description: "AI-powered code reviewer that works while you're away",
    openGraph: {
        title: "AFKmate - Your AI Coding Companion",
        description: "AI-powered code reviewer that works while you're away",
        url: "https://afkmate.in",
        siteName: "AFKmate",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
