// "use client";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth";
// import { useTransition } from "react";

const LogOutButton = () => {
	// const [isPending, startTransition] = useTransition();

	const logout = async () => {
		"use server";
		await signOut({
			redirectTo: "/",
		});
	};

	return (
		<form action={logout}>
			<Button className="w-full mt-2">Sign out</Button>
		</form>
	);
};

export default LogOutButton;
