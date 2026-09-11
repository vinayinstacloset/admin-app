import { z } from "zod";

export const registrationSchema = z.object({
    fullName: z.string().min(2, "Enter your full name."),
    email: z.string().email("Enter a valid email address."),
    password: z.string().min(6, "Password must be at least 6 characters."),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;
