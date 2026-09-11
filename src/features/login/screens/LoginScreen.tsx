import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import AuthLayout from "../../../shared/components/common/AuthLayout";
import { Input } from "../../../shared/components/common/forms";
import { Button } from "../../../shared/components/common/buttons";
import { useLogin } from "../hooks/useLogin";

export default function LoginScreen() {
    const { email, password, isLoading, error, isValid, updateEmail, updatePassword, submit } = useLogin();
    const [showPassword, setShowPassword] = useState(false);

    return (
        <AuthLayout>
            <h1 className="text-lg font-semibold text-ink mb-5">Login into Dashboard</h1>

            <form
                onSubmit={submit}
                className="space-y-4"
            >
                <div>
                    <label className="block text-xs text-ink/70 mb-1.5">Email</label>
                    <Input
                        type="email"
                        value={email}
                        onChange={(event) => updateEmail(event.target.value)}
                        placeholder="Enter email address"
                    />
                </div>

                <div>
                    <label className="block text-xs text-ink/70 mb-1.5">Password</label>
                    <div className="relative">
                        <Input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(event) => updatePassword(event.target.value)}
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
                    <div className="flex justify-end mt-1.5">
                        <Link
                            to="/forgot-password"
                            className="text-xs text-brand-600 hover:underline"
                        >
                            Forgot password?
                        </Link>
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
                    Login
                </Button>

                <p className="text-center text-sm text-ink/60">
                    Don&apos;t have an account?{" "}
                    <Link
                        to="/register"
                        className="text-brand-600 hover:underline"
                    >
                        Create account
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}
