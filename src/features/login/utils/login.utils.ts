export const RESEND_OTP_SECONDS = 60;

export const isValidEmail = (value: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
export const isValidMobile = (value: string): boolean => /^[0-9]{10}$/.test(value);

export function formatMobileDisplay(value: string): string {
    if (value.length <= 5) return value;
    return `${value.slice(0, 5)} ${value.slice(5)}`;
}

export function formatTimer(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remaining = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`;
}
