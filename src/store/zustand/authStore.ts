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
    isAuthenticated: boolean;
    accessToken: string | null;
    refreshToken: string | null;
    admin: AdminProfile | null;

    setAuthenticated: (value: boolean) => void;
    setTokens: (tokens: AuthTokens) => void;
    setAdmin: (admin: AdminProfile | null) => void;
    clearAuth: () => void;
    getTokens: () => {
        accessToken: string | null;
        refreshToken: string | null;
    };
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            isAuthenticated: false,
            accessToken: null,
            refreshToken: null,
            admin: null,

            setAuthenticated: (value) => {
                set({
                    isAuthenticated: value,
                });
            },

            setTokens: ({ accessToken, refreshToken }) => {
                set((state) => ({
                    accessToken:
                        accessToken !== undefined
                            ? accessToken
                            : state.accessToken,
                    refreshToken:
                        refreshToken !== undefined
                            ? refreshToken
                            : state.refreshToken,
                }));
            },

            setAdmin: (admin) => {
                set({
                    admin,
                });
            },

            clearAuth: () => {
                set({
                    isAuthenticated: false,
                    accessToken: null,
                    refreshToken: null,
                    admin: null,
                });
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
                isAuthenticated: state.isAuthenticated,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                admin: state.admin,
            }),
        },
    ),
);