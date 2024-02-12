import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import Discord from "next-auth/providers/discord";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { loginFormSchema } from "@/validators/userSchemas";

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
            },
          });

          if (!user || !user.password) throw new Error("User not found.");

          const passwordMatch = await bcrypt.compare(
            parsedCredentials.password,
            user.password
          );
          if (!passwordMatch) throw new Error("Invalid data.");

          return {
            id: user.id,
            email: user.email,
            image: user.image,
          };
        } catch (err) {
          throw new Error(`Server error: ${err}`);
        }
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async session({ session, token, user }) {
      if (token) {
        session.user.email = String(token.email);
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
      }
      return token;
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
