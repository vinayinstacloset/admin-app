import { ArrowLeft } from "lucide-react";
import { Button } from "../../../shared/components/common/buttons";
import { formatTimer } from "../utils/forgotPassword.utils";
import type { MutableRefObject } from "react";

interface OtpStepProps {
    email: string;
    otp: string[];
    timer: number;
    isLoading: boolean;
    error: string;
    inputsRef: MutableRefObject<Array<HTMLInputElement | null>>;
    onDigitChange: (index: number, value: string) => void;
    onDigitKeyDown: (index: number, key: string) => void;
    onResend: () => void;
    onBack: () => void;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export default function OtpStep({
    email,
    otp,
    timer,
    isLoading,
    error,
    inputsRef,
    onDigitChange,
    onDigitKeyDown,
    onResend,
    onBack,
    onSubmit,
}: OtpStepProps) {
    return (
        <>
            <button
                type="button"
                onClick={onBack}
                className="flex items-center gap-2 text-[15px] font-semibold text-ink mb-4"
            >
                <ArrowLeft size={17} /> Verify otp
            </button>

            <p className="text-sm text-ink/55 mb-4">
                Enter the 6 digit code sent to: <span className="font-semibold text-ink">{email}</span>
            </p>

            <form
                onSubmit={onSubmit}
                className="space-y-4"
            >
                <div className="flex items-center justify-between gap-2">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => {
                                inputsRef.current[index] = el;
                            }}
                            value={digit}
                            onChange={(event) => onDigitChange(index, event.target.value)}
                            onKeyDown={(event) => onDigitKeyDown(index, event.key)}
                            maxLength={1}
                            inputMode="numeric"
                            className="w-11 h-11 text-center rounded-lg border border-black/10 text-[15px] font-semibold outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                        />
                    ))}
                </div>

                <div className="text-right">
                    {timer > 0 ? (
                        <span className="text-xs text-ink/40">Resend OTP in {formatTimer(timer)}</span>
                    ) : (
                        <button
                            type="button"
                            onClick={onResend}
                            className="text-xs text-brand-600 hover:underline"
                        >
                            Resend OTP
                        </button>
                    )}
                </div>

                {error && <p className="text-xs text-red-500">{error}</p>}

                <Button
                    type="submit"
                    variant="brand"
                    size="lg"
                    fullWidth
                    loading={isLoading}
                    disabled={otp.some((digit) => digit === "")}
                    className="uppercase tracking-wide font-semibold"
                >
                    Verify OTP
                </Button>
            </form>
        </>
    );
}
