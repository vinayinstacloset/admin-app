import { z } from "zod";

export const emailStepSchema = z.object({
    email: z.string().email("Enter a valid email address."),
});

export const otpStepSchema = z.object({
    otp: z.string().length(6, "Enter the 6 digit code."),
});

export const newPasswordStepSchema = z
    .object({
        newPassword: z.string().min(6, "Password must be at least 6 characters."),
        confirmPassword: z.string().min(6, "Password must be at least 6 characters."),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match.",
        path: ["confirmPassword"],
    });
