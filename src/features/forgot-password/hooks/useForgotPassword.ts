import { useEffect, useRef, useState, type FormEvent } from "react";
import { forgotPasswordService } from "../api/forgotPasswordApi";
import { RESEND_OTP_SECONDS } from "../utils/forgotPassword.utils";
import type { ForgotPasswordStep } from "../types/forgotPassword.types";

export function useForgotPassword() {
    const [step, setStep] = useState<ForgotPasswordStep>("email");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
    const [timer, setTimer] = useState(RESEND_OTP_SECONDS);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [resetToken, setResetToken] = useState<string | undefined>(undefined);

    const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

    useEffect(() => {
        if (step !== "otp" || timer <= 0) return;

        const intervalId = setInterval(() => setTimer((current) => current - 1), 1000);
        return () => clearInterval(intervalId);
    }, [step, timer]);

    const goBack = () => {
        setError("");

        if (step === "otp") setStep("email");
        else if (step === "new-password") setStep("otp");
    };

    const handleSendOtp = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!email.trim() || isLoading) return;

        setIsLoading(true);
        setError("");

        try {
            await forgotPasswordService.sendOtp({ email });
            setTimer(RESEND_OTP_SECONDS);
            setStep("otp");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to send OTP.");
        } finally {
            setIsLoading(false);
        }
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
        if (isLoading) return;

        setIsLoading(true);
        setError("");

        try {
            await forgotPasswordService.sendOtp({ email });
            setTimer(RESEND_OTP_SECONDS);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to resend OTP.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (otp.some((digit) => digit === "") || isLoading) return;

        setIsLoading(true);
        setError("");

        try {
            const response = await forgotPasswordService.verifyOtp({ email, otp: otp.join("") });
            setResetToken(response.resetToken);
            setStep("new-password");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Invalid or expired OTP.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSavePassword = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!newPassword || newPassword !== confirmPassword || isLoading) return;

        setIsLoading(true);
        setError("");

        try {
            await forgotPasswordService.resetPassword({ email, resetToken, newPassword });
            setSuccess(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to reset password.");
        } finally {
            setIsLoading(false);
        }
    };

    return {
        step,
        email,
        setEmail,
        otp,
        inputsRef,
        timer,
        newPassword,
        setNewPassword,
        confirmPassword,
        setConfirmPassword,
        isLoading,
        error,
        success,
        goBack,
        handleSendOtp,
        updateOtpDigit,
        handleOtpKeyDown,
        handleResendOtp,
        handleVerifyOtp,
        handleSavePassword,
    };
}
