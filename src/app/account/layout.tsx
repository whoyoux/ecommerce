import { Button } from "@/components/ui/button";
import { auth, signOut } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const AccountPageLayout = async ({
	children,
}: { children: React.ReactNode }) => {
	const session = await auth();
	if (!session) return redirect("/login");
	return (
		<div className="max-w-screen-xl mx-auto w-full flex gap-8 pt-10">
			<section className="w-[200px] flex flex-col gap-4">
				<Link href="/account">
					<h2 className="text-xl font-semibold">Account</h2>
				</Link>
				<div className="flex flex-col gap-2">
					<Link
						href="/account/personal-informations"
						className="hover:underline font-semibold underline-offset-4"
					>
						Personal Informations
					</Link>
					<Link
						href="/account/my-orders"
						className="hover:underline font-semibold underline-offset-4"
					>
						My orders
					</Link>
					<Link
						href="/account/wish-list"
						className="hover:underline font-semibold underline-offset-4"
					>
						Wish list
					</Link>
					<LogOutButton />
				</div>
			</section>
			<section className="flex-1 w-full">{children}</section>
		</div>
	);
};

const LogOutButton = () => {
	return (
		<form
			action={async () => {
				"use server";
				await signOut({
					redirectTo: "/",
				});
			}}
		>
			<Button className="w-full mt-2" size="sm">
				Sign out
			</Button>
		</form>
	);
};

export default AccountPageLayout;
