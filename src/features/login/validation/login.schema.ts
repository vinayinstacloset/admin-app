import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  mobile: z
    .string()
    .regex(/^[0-9]{10}$/, "Enter a valid 10 digit mobile number."),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const loginOtpSchema = z.object({
  otp: z.string().regex(/^[0-9]{6}$/, "Enter the 6 digit code."),
});

export type LoginOtpInput = z.infer<typeof loginOtpSchema>;
