"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { loginUser } from "@/actions/user";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginFormSchema } from "@/validators/userSchemas";
import { useState } from "react";

const LoginForm = () => {
	const [isLogging, setLogging] = useState(false);

	const form = useForm<z.infer<typeof loginFormSchema>>({
		resolver: zodResolver(loginFormSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	async function onSubmit(values: z.infer<typeof loginFormSchema>) {
		if (isLogging) return;

		try {
			setLogging(true);
			await loginUser(values.email, values.password);
		} catch (err) {
			form.setError("root.wrongCredentials", {
				message: "Email or password is iscorrect.",
			});
		} finally {
			setLogging(false);
		}
	}
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex flex-col gap-4"
			>
				{form.formState.errors.root?.wrongCredentials && (
					<h2 className="font-semibold text-red-500">
						Wrong email or password.
					</h2>
				)}
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input placeholder="Your email address" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Password</FormLabel>
							<FormControl>
								<Input placeholder="Your password" {...field} type="password" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit" disabled={isLogging} aria-disabled={isLogging}>
					Login
				</Button>
			</form>
		</Form>
	);
};

export default LoginForm;
