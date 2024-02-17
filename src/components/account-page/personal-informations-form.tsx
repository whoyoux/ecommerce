"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { personalInformationsFormSchema } from "@/validators/userSchemas";
import { z } from "zod";

import { savePersonalInformations } from "@/actions/user";
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
import { PersonalInformation } from "@prisma/client";
import { useState } from "react";
import { toast } from "sonner";

//TODO: Preload data from the DB and set to defaultValues

type PersonalInformationsFormProps = {
	personalInformations: PersonalInformation | null;
};

const PersonalInformationsForm = ({
	personalInformations,
}: PersonalInformationsFormProps) => {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<z.infer<typeof personalInformationsFormSchema>>({
		resolver: zodResolver(personalInformationsFormSchema),
		defaultValues: {
			firstName: personalInformations?.firstName ?? "",
			lastName: personalInformations?.lastName ?? "",
			addressLine1: personalInformations?.addressLine1 ?? "",
			addressLine2: personalInformations?.addressLine2 ?? "",
			postalCode: personalInformations?.postalCode ?? "",
			state: personalInformations?.state ?? "",
			city: personalInformations?.city ?? "",
			country: personalInformations?.country ?? "",
			phoneNumber: personalInformations?.phoneNumber ?? undefined,
		},
	});

	async function onSubmit(
		values: z.infer<typeof personalInformationsFormSchema>,
	) {
		setIsSubmitting(true);
		const result = await savePersonalInformations(values);
		setIsSubmitting(false);

		if (result.success) {
			toast.success("Personal informations saved successfully.");
		} else {
			toast.error("Failed to save personal informations.");
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="firstName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>First name</FormLabel>
							<FormControl>
								<Input {...field} placeholder="John" />
							</FormControl>
							<FormDescription>Your first name.</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="lastName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Last name</FormLabel>
							<FormControl>
								<Input {...field} placeholder="Kowalsky" />
							</FormControl>
							<FormDescription>Your last name.</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="addressLine1"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Address line 1</FormLabel>
							<FormControl>
								<Input {...field} placeholder="Address line 1" />
							</FormControl>
							{/* <FormDescription>Your last name.</FormDescription> */}
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="addressLine2"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Address line 2</FormLabel>
							<FormControl>
								<Input {...field} placeholder="Address line 2" />
							</FormControl>
							<FormDescription>This field is optional.</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="city"
					render={({ field }) => (
						<FormItem>
							<FormLabel>City</FormLabel>
							<FormControl>
								<Input {...field} placeholder="Krakow" />
							</FormControl>
							{/* <FormDescription>Your last name.</FormDescription> */}
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="state"
					render={({ field }) => (
						<FormItem>
							<FormLabel>State</FormLabel>
							<FormControl>
								<Input {...field} placeholder="Texas" />
							</FormControl>
							{/* <FormDescription>Your last name.</FormDescription> */}
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="postalCode"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Postal Code</FormLabel>
							<FormControl>
								<Input {...field} placeholder="Postal Code" />
							</FormControl>
							{/* <FormDescription>Your last name.</FormDescription> */}
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="country"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Country</FormLabel>
							<FormControl>
								<Input {...field} placeholder="Poland" />
							</FormControl>
							{/* <FormDescription>Your last name.</FormDescription> */}
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="phoneNumber"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Phone Number</FormLabel>
							<FormControl>
								<Input {...field} placeholder="+48 123 123 123" />
							</FormControl>
							{/* <FormDescription>Your last name.</FormDescription> */}
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="w-full flex justify-end">
					<Button type="submit">Save</Button>
				</div>
			</form>
		</Form>
	);
};

export default PersonalInformationsForm;
