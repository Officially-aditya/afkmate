import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    poweredByHeader: false,

    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    { key: "X-Content-Type-Options", value: "nosniff" },
                    { key: "X-Frame-Options", value: "DENY" },
                    { key: "X-XSS-Protection", value: "1; mode=block" },
                    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
                ],
            },
        ];
    },

    async rewrites() {
        return {
            // beforeFiles rewrites run before checking public/ and app/ routes
            // This lets the static HTML files in public/ serve at clean URLs
            beforeFiles: [
                // Serve landing page from static HTML (no React conversion needed yet)
                { source: "/", destination: "/index.html" },
                { source: "/about", destination: "/about.html" },
                { source: "/premium", destination: "/premium.html" },
                { source: "/blog", destination: "/blog.html" },
                { source: "/changelog", destination: "/changelog.html" },
                { source: "/contact", destination: "/contact.html" },
                { source: "/docs", destination: "/docs.html" },
                { source: "/faq", destination: "/faq.html" },
                { source: "/privacy", destination: "/privacy.html" },
                { source: "/status", destination: "/status.html" },
                { source: "/terms", destination: "/terms.html" },
                // Blog posts
                { source: "/blog/:slug", destination: "/blog/:slug.html" },
                // Docs pages
                { source: "/docs/:slug", destination: "/docs/:slug.html" },
            ],
            afterFiles: [],
            fallback: [],
        };
    },

    async redirects() {
        return [
            {
                source: "/install",
                destination: "https://marketplace.visualstudio.com/items?itemName=afkmate.afkmate",
                permanent: false,
            },
            {
                source: "/github",
                destination: "https://github.com/afkmate/afkmate-vscode",
                permanent: false,
            },
        ];
    },
};

export default nextConfig;
