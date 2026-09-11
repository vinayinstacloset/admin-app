import { useNavigate } from "react-router-dom";

import AuthLayout from "../../../shared/components/common/AuthLayout";
import SuccessModal from "../../../shared/components/modals/SuccessModal";
import EmailStep from "../components/EmailStep";
import OtpStep from "../components/OtpStep";
import NewPasswordStep from "../components/NewPasswordStep";
import { useForgotPassword } from "../hooks/useForgotPassword";

export default function ForgotPasswordScreen() {
    const navigate = useNavigate();

    const {
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
    } = useForgotPassword();

    const handleBack = () => {
        if (step === "email") {
            navigate("/login");
            return;
        }

        goBack();
    };

    return (
        <AuthLayout>
            {step === "email" && (
                <EmailStep
                    email={email}
                    isLoading={isLoading}
                    error={error}
                    onEmailChange={setEmail}
                    onBack={handleBack}
                    onSubmit={handleSendOtp}
                />
            )}

            {step === "otp" && (
                <OtpStep
                    email={email}
                    otp={otp}
                    timer={timer}
                    isLoading={isLoading}
                    error={error}
                    inputsRef={inputsRef}
                    onDigitChange={updateOtpDigit}
                    onDigitKeyDown={handleOtpKeyDown}
                    onResend={handleResendOtp}
                    onBack={handleBack}
                    onSubmit={handleVerifyOtp}
                />
            )}

            {step === "new-password" && (
                <NewPasswordStep
                    newPassword={newPassword}
                    confirmPassword={confirmPassword}
                    isLoading={isLoading}
                    error={error}
                    onNewPasswordChange={setNewPassword}
                    onConfirmPasswordChange={setConfirmPassword}
                    onBack={handleBack}
                    onSubmit={handleSavePassword}
                />
            )}

            <SuccessModal
                open={success}
                message="Congratulations! your password is changed!"
                actionLabel="Login now"
                onAction={() => navigate("/login")}
            />
        </AuthLayout>
    );
}
