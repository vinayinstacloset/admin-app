import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import AuthLayout from "../../../shared/components/common/AuthLayout";
import { Input } from "../../../shared/components/common/forms";
import { Button } from "../../../shared/components/common/buttons";
import SuccessModal from "../../../shared/components/modals/SuccessModal";
import { useRegistration } from "../hooks/useRegistration";

export default function RegistrationScreen() {
    const navigate = useNavigate();
    const { form, isLoading, error, success, isValid, updateField, submit, closeSuccess } = useRegistration();
    const [showPassword, setShowPassword] = useState(false);

    return (
        <AuthLayout>
            <h1 className="text-lg font-semibold text-ink mb-5">Create your account</h1>

            <form
                onSubmit={submit}
                className="space-y-4"
            >
                <div>
                    <label className="block text-xs text-ink/70 mb-1.5">Full Name</label>
                    <Input
                        value={form.fullName}
                        onChange={(event) => updateField("fullName")(event.target.value)}
                        placeholder="Enter your name"
                    />
                </div>

                <div>
                    <label className="block text-xs text-ink/70 mb-1.5">Email</label>
                    <Input
                        type="email"
                        value={form.email}
                        onChange={(event) => updateField("email")(event.target.value)}
                        placeholder="Enter email address"
                    />
                </div>

                <div>
                    <label className="block text-xs text-ink/70 mb-1.5">Password</label>
                    <div className="relative">
                        <Input
                            type={showPassword ? "text" : "password"}
                            value={form.password}
                            onChange={(event) => updateField("password")(event.target.value)}
                            placeholder="Enter password"
                            className="pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((current) => !current)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/30 hover:text-ink/60"
                            tabIndex={-1}
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>

                {error && <p className="text-xs text-red-500">{error}</p>}

                <Button
                    type="submit"
                    variant="brand"
                    size="lg"
                    fullWidth
                    loading={isLoading}
                    disabled={!isValid}
                    className="uppercase tracking-wide font-semibold"
                >
                    Create Account
                </Button>

                <p className="text-center text-sm text-ink/60">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="text-brand-600 hover:underline"
                    >
                        Login
                    </Link>
                </p>
            </form>

            <SuccessModal
                open={success}
                message="Congratulations! your account is created."
                actionLabel="Login now"
                onAction={() => navigate("/login")}
                onClose={closeSuccess}
            />
        </AuthLayout>
    );
}
