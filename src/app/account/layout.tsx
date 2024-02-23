import { Button, buttonVariants } from "@/components/ui/button";
import { auth, signOut } from "@/lib/auth";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

import LogOutButton from "@/components/logout-button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { User } from "@prisma/client";

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
		<div className="max-w-screen-xl mx-auto w-full flex flex-col md:flex-row gap-8 pt-10">
			<Nav userRole={session.user.role} />
			<section className="flex-1 w-full">{children}</section>
		</div>
	);
};

const Nav = ({ userRole }: { userRole: User["role"] }) => {
	return (
		<>
			<MobileNav className="flex md:hidden" userRole={userRole} />
			<DesktopNav className="hidden md:flex" userRole={userRole} />
		</>
	);
};

const MobileNav = ({
	className,
	userRole,
}: { className?: string; userRole: User["role"] }) => {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<div
					className={cn("w-full flex items-center justify-between", className)}
				>
					<h2 className="text-2xl font-semibold">Account</h2>
					<Button>Open menu</Button>
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

					{userRole === "ADMIN" && (
						<Link
							href="/admin"
							className={cn(
								buttonVariants({ variant: "secondary", size: "lg" }),
								"text-red-500",
							)}
						>
							Admin dashboard
						</Link>
					)}

					<LogOutButton />
				</div>
			</SheetContent>
		</Sheet>
	);
};

const DesktopNav = ({
	className,
	userRole,
}: { className?: string; userRole: User["role"] }) => {
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
				{userRole === "ADMIN" && (
					<Link
						href="/admin"
						className="hover:underline font-semibold underline-offset-4 text-red-500"
					>
						Admin dashboard
					</Link>
				)}
				<LogOutButton />
			</div>
		</section>
	);
};

export default AccountPageLayout;
