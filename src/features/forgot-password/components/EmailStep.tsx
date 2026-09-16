import { ArrowLeft, X } from "lucide-react";
import { Input } from "../../../shared/components/common/forms";
import { Button } from "../../../shared/components/common/buttons";

interface EmailStepProps {
    email: string;
    isLoading: boolean;
    error: string;
    onEmailChange: (value: string) => void;
    onBack: () => void;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export default function EmailStep({ email, isLoading, error, onEmailChange, onBack, onSubmit }: EmailStepProps) {
    return (
        <>
            <button
                type="button"
                onClick={onBack}
                className="flex items-center gap-2 text-[15px] font-semibold text-ink mb-4"
            >
                <ArrowLeft size={17} /> Forgot password
            </button>

            <p className="text-sm text-ink/55 mb-4">Enter your email address to get OTP</p>

            <form
                onSubmit={onSubmit}
                className="space-y-4"
            >
                <div>
                    <label className="block text-xs text-ink/70 mb-1.5">Email</label>
                    <div className="relative">
                        <Input
                            type="email"
                            value={email}
                            onChange={(event) => onEmailChange(event.target.value)}
                            className="pr-9"
                            placeholder="Enter email"
                        />
                        {email && (
                            <button
                                type="button"
                                onClick={() => onEmailChange("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/30 hover:text-ink/60"
                            >
                                <X size={15} />
                            </button>
                        )}
                    </div>
                </div>

                {error && <p className="text-xs text-red-500">{error}</p>}

                <Button
                    type="submit"
                    variant="brand"
                    size="lg"
                    fullWidth
                    loading={isLoading}
                    disabled={!email.trim()}
                    className="uppercase tracking-wide font-semibold"
                >
                    Send OTP
                </Button>
            </form>
        </>
    );
}
