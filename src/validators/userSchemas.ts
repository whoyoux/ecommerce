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
		acceptTerms: z.boolean().default(false),
	})
	.refine((record) => record.password === record.confirmPassword, {
		message: "Passwords dont match",
		path: ["confirmPassword"],
	})
	.refine((record) => record.acceptTerms, {
		message: "You must accept Terms and Conditions",
		path: ["acceptTerms"],
	});

export const loginFormSchema = z.object({
	email: z
		.string()
		.email("Please provide a valid email address.")
		.min(5, "Please provide more than 5 characters."),
	password: z.string().min(8, "Password must contain at least 8 characters."),
});

export const personalInformationsFormSchema = z.object({
	firstName: z.string().min(1).max(255),
	lastName: z.string().min(1).max(255),

	addressLine1: z.string().min(1).max(255),
	addressLine2: z.string().optional(),

	postalCode: z.string().min(1).max(255),

	state: z.string().min(1).max(255),
	city: z.string().min(1).max(255),
	country: z.string().min(1).max(255),

	phoneNumber: z.string().min(1).max(50),
});
