import { z } from "zod";

export const createUserSchema = z
  .object({
    email: z
      .string()
      .email("Please provide a valid email address.")
      .min(5, "Please provide more than 5 characters."),
    password: z.string().min(8, "Password must contain at least 8 characters."),
    confirmPassword: z
      .string()
      .min(8, "Password must contain at least 8 characters."),
  })
  .refine((record) => record.password === record.confirmPassword, {
    message: "Passwords dont match",
    path: ["confirmPassword"],
  });

export const loginFormSchema = z.object({
  email: z
    .string()
    .email("Please provide a valid email address.")
    .min(5, "Please provide more than 5 characters."),
  password: z.string().min(8, "Password must contain at least 8 characters."),
});
