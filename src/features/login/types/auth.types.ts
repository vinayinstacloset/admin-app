export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    accessToken?: string;
    token?: string;
    refreshToken?: string;
    admin?: {
        id?: string;
        name?: string;
        email?: string;
        role?: string;
    };
    message?: string;
    [key: string]: unknown;
}
