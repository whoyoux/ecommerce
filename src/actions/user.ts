"use server";

import { randomUUID } from "crypto";
import { auth, signIn } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { addStripeCustomer } from "@/lib/stripe";
import {
	createUserSchema,
	personalInformationsFormSchema,
} from "@/validators/userSchemas";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { z } from "zod";

type RegisterResult =
	| {
			error: true;
			errorCode:
				| "USER_EXIST"
				| "PASSWORDS_DONT_MATCH"
				| "SERVER_ERROR"
				| "INVALID_DATA";
			message?: string;
	  }
	| {
			error: false;
			message: string;
	  };

export const createUser = async (
	values: z.infer<typeof createUserSchema>,
): Promise<RegisterResult> => {
	try {
		const parsedCredentials = createUserSchema.safeParse(values);

		if (!parsedCredentials.success) {
			return {
				error: true,
				errorCode: "INVALID_DATA",
			};
		}

		const { email, password, confirmPassword } = parsedCredentials.data;

		if (password !== confirmPassword) {
			return {
				error: true,
				errorCode: "PASSWORDS_DONT_MATCH",
				message: "Please provide valid passwords.",
			};
		}

		const existUser = await prisma.user.findUnique({
			where: {
				email,
			},
		});

		if (existUser) {
			return {
				error: true,
				errorCode: "USER_EXIST",
				message: "This email is already taken.",
			};
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const createdUser = await prisma.user.create({
			data: {
				email: email,
				password: hashedPassword,
			},
		});

		const token = await prisma.activateToken.create({
			data: {
				token: `${randomUUID()}${randomUUID()}`.replace(/-/g, ""),
				userId: createdUser.id,
			},
		});

		await resend.emails.send({
			from: "support@whxtest.pl",
			subject: "Activate your account - Fresh & Clean Ecommerce Store",
			to: [email],
			html: `Please click this link to <a href="http://localhost:3000/activate/${token.token}">activate your account</a>`,
		});

		//TODO: I think it should be done after email verification
		await addStripeCustomer({
			id: createdUser.id,
			email: createdUser.email,
		});
	} catch (err) {
		return {
			error: true,
			errorCode: "SERVER_ERROR",
			message: `Server error: ${err}`,
		};
	}
	redirect("/");
};

type SavePersonalInformationsResult = {
	success: boolean;
};

export const savePersonalInformations = async (
	values: z.infer<typeof personalInformationsFormSchema>,
): Promise<SavePersonalInformationsResult> => {
	const parsedFormData = personalInformationsFormSchema.safeParse(values);

	if (!parsedFormData.success) {
		return {
			success: false,
		};
	}

	const session = await auth();
	if (!session || !session.user?.id) {
		return {
			success: false,
		};
	}

	try {
		await prisma.personalInformation.upsert({
			where: {
				userId: session.user.id,
			},
			update: {
				...parsedFormData.data,
			},
			create: {
				...parsedFormData.data,
				user: {
					connect: {
						id: session.user.id,
					},
				},
			},
		});

		return {
			success: true,
		};
	} catch (err) {
		console.error(`Error while saving personal informations: ${err}`);
		return {
			success: false,
		};
	}
};

export const loginUser = async (email: string, password: string) => {
	await signIn("credentials", {
		email,
		password,
		redirectTo: "/",
	});
};
