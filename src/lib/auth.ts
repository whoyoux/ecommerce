import { prisma } from "@/lib/prisma";
import { loginFormSchema } from "@/validators/userSchemas";
import { DefaultJWT } from "@auth/core/jwt";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import NextAuth from "next-auth";
import type { DefaultSession, NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Discord from "next-auth/providers/discord";
import { addStripeCustomer } from "./stripe";

declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			role: User["role"];
		} & DefaultSession["user"];
	}
}

declare module "@auth/core/jwt" {
	interface JWT extends DefaultJWT {
		role: User["role"];
	}
}

export const authConfig = {
	providers: [
		Discord,
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: {
					label: "Email",
					type: "text",
				},
				password: {
					label: "Password",
					type: "password",
				},
			},
			async authorize(credentials, req) {
				try {
					if (!credentials) throw new Error("Provided invalid credentials.");

					const parsedCredentials =
						await loginFormSchema.parseAsync(credentials);

					const user = await prisma.user.findUnique({
						where: {
							email: parsedCredentials.email,
						},
						select: {
							id: true,
							email: true,
							password: true,
							emailVerified: true,
							image: true,
							active: true,
							role: true,
						},
					});

					if (!user || !user.password) throw new Error("User not found.");

					if (!user.active) throw new Error("User is not active.");

					const passwordMatch = await bcrypt.compare(
						parsedCredentials.password,
						user.password,
					);
					if (!passwordMatch) throw new Error("Invalid data.");
					// if (!passwordMatch) return null;

					return {
						id: user.id,
						email: user.email,
						image: user.image,
						role: user.role,
					};
				} catch (err) {
					throw new Error(`Server error: ${err}`);
					// return null;
				}
			},
		}),
	],
	adapter: PrismaAdapter(prisma),
	callbacks: {
		async jwt({ token, user, session }) {
			if (user) {
				token.email = user.email;
				token.role = (user as User).role;
			}
			return token;
		},
		async session({ session, token, user }) {
			if (token) {
				session.user.email = String(token.email);
				session.user.id = String(token.sub);
				session.user.role = token.role;
			}
			return session;
		},
	},
	events: {
		async createUser({ user }) {
			//This code is executed when a new user is logging with 3rd party provider only
			await addStripeCustomer({ id: user.id, email: user.email });
		},
	},
	session: {
		strategy: "jwt",
		maxAge: 30 * 24 * 60 * 60, // 30 days
	},
	pages: {
		signIn: "/login",
	},
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
