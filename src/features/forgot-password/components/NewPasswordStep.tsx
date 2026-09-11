import { useState } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Input } from "../../../shared/components/common/forms";
import { Button } from "../../../shared/components/common/buttons";

interface NewPasswordStepProps {
    newPassword: string;
    confirmPassword: string;
    isLoading: boolean;
    error: string;
    onNewPasswordChange: (value: string) => void;
    onConfirmPasswordChange: (value: string) => void;
    onBack: () => void;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export default function NewPasswordStep({
    newPassword,
    confirmPassword,
    isLoading,
    error,
    onNewPasswordChange,
    onConfirmPasswordChange,
    onBack,
    onSubmit,
}: NewPasswordStepProps) {
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const mismatch = Boolean(confirmPassword) && newPassword !== confirmPassword;

    return (
        <>
            <button
                type="button"
                onClick={onBack}
                className="flex items-center gap-2 text-[15px] font-semibold text-ink mb-4"
            >
                <ArrowLeft size={17} /> New password
            </button>

            <form
                onSubmit={onSubmit}
                className="space-y-4"
            >
                <div>
                    <label className="block text-xs text-ink/70 mb-1.5">New password</label>
                    <div className="relative">
                        <Input
                            type={showNew ? "text" : "password"}
                            value={newPassword}
                            onChange={(event) => onNewPasswordChange(event.target.value)}
                            placeholder="Enter new password"
                            className="pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowNew((current) => !current)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/30 hover:text-ink/60"
                            tabIndex={-1}
                        >
                            {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-xs text-ink/70 mb-1.5">Confirm password</label>
                    <div className="relative">
                        <Input
                            type={showConfirm ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(event) => onConfirmPasswordChange(event.target.value)}
                            placeholder="Re-enter new password"
                            className="pr-10"
                            error={mismatch}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirm((current) => !current)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/30 hover:text-ink/60"
                            tabIndex={-1}
                        >
                            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    {mismatch && <p className="text-[11px] text-red-500 mt-1">Passwords do not match.</p>}
                </div>

                {error && <p className="text-xs text-red-500">{error}</p>}

                <Button
                    type="submit"
                    variant="brand"
                    size="lg"
                    fullWidth
                    loading={isLoading}
                    disabled={!newPassword || newPassword !== confirmPassword}
                    className="uppercase tracking-wide font-semibold"
                >
                    Save Password
                </Button>
            </form>
        </>
    );
}
