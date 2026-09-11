// TODO: Once the backend can issue an HttpOnly + Secure cookie for the
// refresh token, drop it from this store entirely — access token only
// needs to live in memory / sessionStorage.

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface AdminProfile {
    id?: string | null;
    name?: string | null;
    email?: string | null;
    role?: string | null;
}

interface AuthTokens {
    accessToken?: string | null;
    refreshToken?: string | null;
}

interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
    admin: AdminProfile | null;
    setTokens: (tokens: AuthTokens) => void;
    setAdmin: (admin: AdminProfile | null) => void;
    clearTokens: () => void;
    getTokens: () => { accessToken: string | null; refreshToken: string | null };
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            accessToken: null,
            refreshToken: null,
            admin: null,

            setTokens: ({ accessToken, refreshToken }) => {
                set((state) => ({
                    accessToken: accessToken !== undefined ? accessToken : state.accessToken,
                    refreshToken: refreshToken !== undefined ? refreshToken : state.refreshToken,
                }));
            },

            setAdmin: (admin) => set({ admin }),

            clearTokens: () => {
                set({ accessToken: null, refreshToken: null, admin: null });
            },

            getTokens: () => {
                const state = get();

                return {
                    accessToken: state.accessToken,
                    refreshToken: state.refreshToken,
                };
            },
        }),

        {
            name: "admin-auth-storage",
            storage: createJSONStorage(() => sessionStorage),
            partialize: (state) => ({
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                admin: state.admin,
            }),
        },
    ),
);
