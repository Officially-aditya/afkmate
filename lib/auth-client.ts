import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "https://api.afkmate.in",
});

export const { signIn, signOut, useSession } = authClient;
