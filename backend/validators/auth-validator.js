import { z } from "zod";

const registerSchema = z.object({
    display_name: z.string().nonempty(),
    login: z.string().min(3).max(32),
    email: z.string().email(),
    password: z.string().min(8),
});

const loginSchema = z.object({
    login: z.string().min(3).max(32),
    password: z.string().min(8),
});

const jwtRefreshSchema = z.object({
    token: z.jwt()
});

const emailSchema = z.object({
    email: z.email()
});

const passwordResetSchema = z.object({
    new_password: z.string().min(8),
});

export { registerSchema, loginSchema, jwtRefreshSchema, emailSchema, passwordResetSchema };
