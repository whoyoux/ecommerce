import LoginForm from "@/components/login-page/login-form";
import { Button, buttonVariants } from "@/components/ui/button";
import { signIn } from "@/lib/auth";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

//Main idea - user create account with email and password
//for personal infomations user will be asked after login or within first buy

const LoginPage = async () => {
	return (
		<div className="max-w-lg mx-auto flex flex-col gap-10 pt-10">
			<h1 className="text-2xl font-bold text-center">Login</h1>
			<LoginForm />
			<section className="text-center flex flex-col gap-4 w-full">
				<h3 className="text-xl font-semibold">Dont have an account?</h3>
				<div className="flex items-center gap-2 justify-between w-full">
					<Link
						href="/create-account"
						className={cn(buttonVariants({ variant: "secondary" }), "w-full")}
					>
						Create new account
					</Link>
					<form
						action={async () => {
							"use server";
							await signIn("discord");
						}}
						className="w-full"
					>
						<Button className="w-full">Login via Discord</Button>
					</form>
				</div>
			</section>
		</div>
	);
};

export default LoginPage;
