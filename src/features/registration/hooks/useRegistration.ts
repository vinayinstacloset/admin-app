import { useState, type FormEvent } from "react";
import { adminRegistrationService } from "../api/adminApi";
import { isValidEmail, isValidFullName, isValidPassword } from "../utils/registration.utils";
import type { RegistrationFormState } from "../types/registration.types";

const initialState: RegistrationFormState = {
    fullName: "",
    email: "",
    password: "",
};

export function useRegistration() {
    const [form, setForm] = useState<RegistrationFormState>(initialState);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const isValid = isValidFullName(form.fullName) && isValidEmail(form.email) && isValidPassword(form.password);

    const updateField = (key: keyof RegistrationFormState) => (value: string) => {
        setForm((current) => ({ ...current, [key]: value }));
        setError("");
    };

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!isValid || isLoading) {
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            await adminRegistrationService.register(form);
            setSuccess(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create account. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return {
        form,
        isLoading,
        error,
        success,
        isValid,
        updateField,
        submit,
        closeSuccess: () => setSuccess(false),
    };
}
