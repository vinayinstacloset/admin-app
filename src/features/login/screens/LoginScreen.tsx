import { X } from "lucide-react";

import AuthLayout from "../../../shared/components/common/AuthLayout";
import { Input } from "../../../shared/components/common/forms";
import { Button } from "../../../shared/components/common/buttons";
import Modal from "../../../shared/components/modals/Modal";
import { useLogin } from "../hooks/useLogin";
import { formatTimer } from "../utils/login.utils";

export default function LoginScreen() {
  const {
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
  } = useLogin();

  const isMobileValid = /^[6-9]\d{9}$/.test(mobile);
  const isLoginValid = isValid && isMobileValid;

  const handleMobileChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
    updateMobile(digitsOnly);
  };

  return (
    <AuthLayout>
      <h1 className="mb-4 text-lg font-semibold text-ink">
        Login into Dashboard
      </h1>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs text-ink">Email</label>

          <div className="relative">
            <Input
              type="email"
              value={email}
              onChange={(event) => updateEmail(event.target.value)}
              placeholder="Enter email address"
              className="pr-10"
            />

            {email && (
              <button
                type="button"
                onClick={clearEmail}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/30 hover:text-ink/60"
                tabIndex={-1}
                aria-label="Clear email"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs text-ink">
            Mobile No.
          </label>

          <div className="relative flex items-center rounded-lg border border-black/10 bg-white transition focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100">
            <span className="select-none border-r border-black/10 py-2.5 pl-3.5 pr-2 text-sm text-ink/70">
              +91
            </span>

            <input
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              value={mobile}
              onChange={(event) => handleMobileChange(event.target.value)}
              placeholder="Enter mobile no."
              maxLength={10}
              pattern="[6-9][0-9]{9}"
              title="Enter a valid 10-digit mobile number starting with 6, 7, 8, or 9"
              aria-invalid={mobile.length > 0 && !isMobileValid}
              className="w-full min-w-0 bg-transparent px-3 py-2.5 text-sm text-ink outline-none placeholder:text-ink/35"
            />

            {mobile && (
              <button
                type="button"
                onClick={clearMobile}
                className="pr-3.5 text-ink/30 hover:text-ink/60"
                tabIndex={-1}
                aria-label="Clear mobile number"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {mobile.length > 0 && !isMobileValid && (
            <p className="mt-1.5 text-xs text-red-500">
              Enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.
            </p>
          )}
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}

        <Button
          type="submit"
          variant="brand"
          size="lg"
          fullWidth
          loading={isLoading}
          disabled={!isLoginValid || isLoading}
          className="font-semibold uppercase tracking-wide"
        >
          Login
        </Button>
      </form>

      <Modal
        open={otpModalOpen}
        onClose={closeOtpModal}
        widthClassName="max-w-[420px]"
      >
        <div className="mb-4 flex items-center justify-between border-b border-black/10 pb-4">
          <h2 className="text-base font-semibold text-ink">Enter OTP</h2>
        </div>

        <p className="mb-4 text-sm text-ink/60">
          Enter the 6 digit code sent to:
          <br />
          <span className="font-semibold text-ink">+91 {mobile}</span>
        </p>

        <form onSubmit={verifyOtp} className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputsRef.current[index] = el;
                }}
                value={digit}
                onChange={(event) =>
                  updateOtpDigit(index, event.target.value)
                }
                onKeyDown={(event) =>
                  handleOtpKeyDown(index, event.key)
                }
                maxLength={1}
                inputMode="numeric"
                autoFocus={index === 0}
                aria-label={`OTP digit ${index + 1}`}
                className="h-11 w-11 rounded-lg border border-black/10 text-center text-[15px] font-semibold outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              />
            ))}
          </div>

          {otpError && (
            <p className="text-xs text-red-500">{otpError}</p>
          )}

          <Button
            type="submit"
            variant="brand"
            size="lg"
            fullWidth
            loading={isVerifying}
            disabled={otp.some((digit) => digit === "") || isVerifying}
            className="font-semibold"
          >
            Submit
          </Button>

          <div className="text-center">
            {timer > 0 ? (
              <span className="text-xs text-ink/40">
                Resend code in {formatTimer(timer)}
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isResending}
                className="text-xs text-ink/70 hover:text-brand-600 hover:underline disabled:opacity-50"
              >
                Resend code
              </button>
            )}
          </div>
        </form>
      </Modal>
    </AuthLayout>
  );
}