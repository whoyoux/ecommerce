import { Button, buttonVariants } from "@/components/ui/button";
import { auth, signOut } from "@/lib/auth";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";

const links = [
	{
		label: "Personal Informations",
		href: "/account/personal-informations",
	},
	{
		label: "My orders",
		href: "/account/my-orders",
	},
	{
		label: "Wish list",
		href: "/account/wish-list",
	},
];

const AccountPageLayout = async ({
	children,
}: { children: React.ReactNode }) => {
	const session = await auth();
	if (!session) return redirect("/login");
	return (
		<div className="max-w-screen-xl mx-auto w-full flex flex-col gap-8 pt-10">
			<Nav />
			<section className="flex-1 w-full">{children}</section>
		</div>
	);
};

const Nav = () => {
	return (
		<>
			<MobileNav className="block md:hidden" />
			<DesktopNav className="hidden md:block" />
		</>
	);
};

const MobileNav = ({ className }: { className?: string }) => {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<div className="w-full flex items-center justify-between">
					<h2 className="text-2xl font-semibold">Account</h2>
					<Button className={cn(className)}>Open menu</Button>
				</div>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Account</SheetTitle>
				</SheetHeader>

				<div className="flex flex-col gap-4 pt-8">
					{links.map((link) => (
						<Link
							href={link.href}
							className={cn(
								buttonVariants({ variant: "secondary", size: "lg" }),
							)}
							key={`account-link-${link.label}`}
						>
							{link.label}
						</Link>
					))}
					<LogOutButton />
				</div>
			</SheetContent>
		</Sheet>
	);
};

const DesktopNav = ({ className }: { className?: string }) => {
	return (
		<section className={cn("w-[200px] flex flex-col gap-4", className)}>
			<Link href="/account">
				<h2 className="text-xl font-semibold">Account</h2>
			</Link>
			<div className="flex flex-col gap-2 pt-4">
				{links.map((link) => (
					<Link
						href={link.href}
						className="hover:underline font-semibold underline-offset-4"
						key={`account-link-${link.label}`}
					>
						{link.label}
					</Link>
				))}
				<LogOutButton />
			</div>
		</section>
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
			<Button className="w-full mt-2">Sign out</Button>
		</form>
	);
};

export default AccountPageLayout;
