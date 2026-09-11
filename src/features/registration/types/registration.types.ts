export interface AdminRegistrationRequest {
    fullName: string;
    email: string;
    password: string;
}

export interface AdminRegistrationResponse {
    id?: string;
    message?: string;
    success?: boolean;
    [key: string]: unknown;
}

export interface RegistrationFormState {
    fullName: string;
    email: string;
    password: string;
}
