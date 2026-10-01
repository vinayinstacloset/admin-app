import { useEffect, useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/zustand/authStore";
import { authService } from "../api/authApi";
import { isValidEmail, isValidMobile, RESEND_OTP_SECONDS } from "../utils/login.utils";

export function useLogin() {
    const navigate = useNavigate();

    const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
    const [timer, setTimer] = useState(RESEND_OTP_SECONDS);
    const [otpModalOpen, setOtpModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [error, setError] = useState("");
    const [otpError, setOtpError] = useState("");

    const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

    const isValid = isValidEmail(email) && isValidMobile(mobile);

    useEffect(() => {
        if (!otpModalOpen || timer <= 0) return;

        const intervalId = setInterval(() => setTimer((current) => current - 1), 1000);
        return () => clearInterval(intervalId);
    }, [otpModalOpen, timer]);

    const updateEmail = (value: string) => {
        setEmail(value);
        setError("");
    };

    const updateMobile = (value: string) => {
        const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
        setMobile(digitsOnly);
        setError("");
    };

    const clearEmail = () => updateEmail("");
    const clearMobile = () => updateMobile("");

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!isValid || isLoading) {
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            //await authService.sendOtp({ email, mobile });
            //setOtp(Array(6).fill(""));
            //setTimer(RESEND_OTP_SECONDS);
            //setOtpError("");
            setOtpModalOpen(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to send OTP. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const closeOtpModal = () => {
        setOtpModalOpen(false);
        setOtpError("");
    };

    const updateOtpDigit = (index: number, value: string) => {
        if (value && !/^[0-9]$/.test(value)) return;

        const next = [...otp];
        next[index] = value;
        setOtp(next);

        if (value && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, key: string) => {
        if (key === "Backspace" && !otp[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handleResendOtp = async () => {
        if (isResending || timer > 0) return;

        setIsResending(true);
        setOtpError("");

        try {
            await authService.sendOtp({ email, mobile });
            setOtp(Array(6).fill(""));
            setTimer(RESEND_OTP_SECONDS);
            inputsRef.current[0]?.focus();
        } catch (err) {
            setOtpError(err instanceof Error ? err.message : "Failed to resend OTP.");
        } finally {
            setIsResending(false);
        }
    };

    const verifyOtp = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (otp.some((digit) => digit === "") || isVerifying) {
            return;
        }

        setIsVerifying(true);
        setOtpError("");

        try {
            //await authService.verifyOtp({ email, mobile, otp: otp.join("") });
            setAuthenticated(true);

            navigate("/admin-dashboard", {
                replace: true,
            });
        } catch (err) {
            setOtpError(err instanceof Error ? err.message : "Invalid or expired OTP.");
        } finally {
            setIsVerifying(false);
        }
    };

    return {
        email,
        mobile,
        isLoading,
        error,
        isValid,
        updateEmail,
        updateMobile,
        clearEmail,
        clearMobile,
        submit,

        otp,
        otpError,
        otpModalOpen,
        isVerifying,
        isResending,
        timer,
        inputsRef,
        closeOtpModal,
        updateOtpDigit,
        handleOtpKeyDown,
        handleResendOtp,
        verifyOtp,
    };
}
