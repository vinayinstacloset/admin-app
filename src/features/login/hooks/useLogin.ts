import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../api/authApi";
import { isValidEmail, isValidPassword } from "../utils/login.utils";

export function useLogin() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const isValid = isValidEmail(email) && isValidPassword(password);

    const updateEmail = (value: string) => {
        setEmail(value);
        setError("");
    };

    const updatePassword = (value: string) => {
        setPassword(value);
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
            //await authService.login({ email, password });
            navigate("/admin-dashboard");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to login. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return {
        email,
        password,
        isLoading,
        error,
        isValid,
        updateEmail,
        updatePassword,
        submit,
    };
}
