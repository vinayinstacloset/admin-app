export const RESEND_OTP_SECONDS = 60;

export function formatTimer(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remaining = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`;
}
