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

  return (
    <AuthLayout>
      <h1 className="text-lg font-semibold text-ink mb-5">
        Login into Dashboard
      </h1>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-ink/70 mb-1.5">
            Email
          </label>
          <div className="relative">
            <Input
              type="email"
              value={email}
              onChange={(event) => updateEmail(event.target.value)}
              placeholder="Enter email address"
              className={email ? "pr-10 font-medium" : "pr-10"}
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
          <label className="block text-xs font-medium text-ink/70 mb-1.5">
            Mobile No.
          </label>
          <div className="relative flex items-center rounded-lg border border-black/10 bg-white focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100 transition">
            <span className="pl-3.5 pr-2 text-sm text-ink/70 border-r border-black/10 py-2.5 select-none">
              +91
            </span>
            <input
              type="tel"
              inputMode="numeric"
              value={mobile}
              onChange={(event) => updateMobile(event.target.value)}
              placeholder="Enter mobile no."
              className={`w-full bg-transparent px-3 py-2.5 text-sm text-ink outline-none placeholder:text-ink/35 ${
                mobile ? "font-medium" : ""
              }`}
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
      </form>

      <Modal
        open={otpModalOpen}
        onClose={closeOtpModal}
        widthClassName="max-w-[420px]"
      >
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-black/10">
          <h2 className="text-base font-semibold text-ink">Enter OTP</h2>
        </div>

        <p className="text-sm text-ink/60 mb-4">
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
                onChange={(event) => updateOtpDigit(index, event.target.value)}
                onKeyDown={(event) => handleOtpKeyDown(index, event.key)}
                maxLength={1}
                inputMode="numeric"
                autoFocus={index === 0}
                className="w-11 h-11 text-center rounded-lg border border-black/10 text-[15px] font-semibold outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              />
            ))}
          </div>

          {otpError && <p className="text-xs text-red-500">{otpError}</p>}

          <Button
            type="submit"
            variant="brand"
            size="lg"
            fullWidth
            loading={isVerifying}
            disabled={otp.some((digit) => digit === "")}
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
                className="text-xs font-medium text-ink/70 hover:text-brand-600 hover:underline"
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
