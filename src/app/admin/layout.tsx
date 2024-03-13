import NavButton from "@/components/admin-page/nav-button";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Home, LineChart, Package, ShoppingCart, Users } from "lucide-react";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";

const LINKS = [
	{ href: "/admin", label: "Home", icon: <Home size={18} /> },
	{ href: "/admin/products", label: "Products", icon: <Package size={18} /> },
	{ href: "/admin/orders", label: "Orders", icon: <ShoppingCart size={18} /> },
	{ href: "/admin/customers", label: "Customers", icon: <Users size={18} /> },
	{
		href: "/admin/analytics",
		label: "Analytics",
		icon: <LineChart size={18} />,
	},
];

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
	const session = await auth();
	if (!session || session.user.role !== "ADMIN") return notFound();

	return (
		<div className="flex flex-col lg:flex-row gap-2 px-4 lg:px-20 mx-auto w-full h-[calc(100dvh-90px)]">
			<Nav />
			<div className="flex-1 pt-10">{children}</div>
		</div>
	);
};

const Nav = () => {
	return (
		<>
			<MobileNav className="flex lg:hidden" />
			<DesktopNav className="hidden lg:flex" />
		</>
	);
};

const DesktopNav = ({ className }: { className?: string }) => {
	return (
		<div
			className={cn(
				"border-r w-[200px] pr-2 flex flex-col gap-1 pt-10",
				className,
			)}
		>
			{LINKS.map((link) => (
				<NavButton
					key={link.href}
					href={link.href}
					label={link.label}
					icon={link.icon}
				/>
			))}
		</div>
	);
};

const MobileNav = ({ className }: { className?: string }) => {
	return (
		<div className={cn("", className)}>
			<Sheet>
				<SheetTrigger asChild>
					<div
						className={cn(
							"w-full flex items-center justify-between pt-4",
							className,
						)}
					>
						<h2 className="text-2xl font-semibold">Admin menu</h2>
						<Button>Open menu</Button>
					</div>
				</SheetTrigger>
				<SheetContent>
					<SheetHeader>
						<SheetTitle>Admin</SheetTitle>
					</SheetHeader>

					<div className="flex flex-col gap-4 pt-8">
						{LINKS.map((link) => (
							<NavButton
								key={link.href}
								href={link.href}
								label={link.label}
								icon={link.icon}
							/>
						))}
					</div>
				</SheetContent>
			</Sheet>
		</div>
	);
};

export default AdminLayout;
