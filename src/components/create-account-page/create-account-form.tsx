"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { createUser } from "@/actions/user";
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
import { createUserSchema } from "@/validators/userSchemas";
import { useState } from "react";
import { toast } from "sonner";

const CreateAccountForm = () => {
	const [isCreating, setCreating] = useState(false);

	const form = useForm<z.infer<typeof createUserSchema>>({
		resolver: zodResolver(createUserSchema),
		defaultValues: {
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	async function onSubmit(values: z.infer<typeof createUserSchema>) {
		if (isCreating) return;

		setCreating(true);
		const result = await createUser(values);
		setCreating(false);

		if (!result?.error) {
			toast.success("Account created successfully! Please log in.");
		} else {
			toast.error(result.message || "Something went wrong.");
		}
	}
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex flex-col gap-4"
			>
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
				<FormField
					control={form.control}
					name="confirmPassword"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Confirm Password</FormLabel>
							<FormControl>
								<Input
									placeholder="Your password again"
									{...field}
									type="password"
								/>
							</FormControl>
							<FormDescription>
								Please write your password again.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit" disabled={isCreating} aria-disabled={isCreating}>
					Create new account
				</Button>
			</form>
		</Form>
	);
};

export default CreateAccountForm;
