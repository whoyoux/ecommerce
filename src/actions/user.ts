"use server";

import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { createUserSchema } from "@/validators/userSchemas";
import { signIn } from "@/lib/auth";
import { redirect } from "next/navigation";

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
  values: z.infer<typeof createUserSchema>
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

    console.log(createdUser);
    redirect("/");

    return {
      error: false,
      message: "New account created",
    };
  } catch (err) {
    return {
      error: true,
      errorCode: "SERVER_ERROR",
      message: `Server error: ${err}`,
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
