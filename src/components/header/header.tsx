import { Button, buttonVariants } from "@/components/ui/button";
import { Menu, Search, ShoppingCart, User } from "lucide-react";
import Link from "next/link";

import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import SearchFormDialog from "../search-form-dialog";
import { Suspense } from "react";

const NAV_ITEMS = [
	{
		label: "Clothes",
		href: "/search?category=Clothes",
	},
	{
		label: "Electronics",
		href: "/search?category=Electronics",
	},
	{
		label: "Furniture",
		href: "/search?category=Furniture",
	},
	{
		label: "Shoes",
		href: "/search?category=Shoes",
	},
	{
		label: "Miscellaneous",
		href: "/search?category=Miscellaneous",
	},
];

const WEBSITE_TITLE = "Fresh & Clean";

const Header = () => {
	return (
		<header className="w-full border-b px-10 py-6 flex items-center justify-between">
			<Link href="/">
				<h1 className="text-xl font-bold">{WEBSITE_TITLE}</h1>
			</Link>
			<div className="hidden lg:flex">
				<DesktopNav />
			</div>
			<div className="flex lg:hidden">
				<MobileNav />
			</div>
		</header>
	);
};

const DesktopNav = () => {
	return (
		<div className="flex items-center gap-8">
			{NAV_ITEMS.map((item) => (
				<Link
					href={item.href}
					key={`di-${item.href}`}
					className={cn(buttonVariants({ variant: "link" }), "px-0")}
				>
					<h2 className="text-sm md:text-lg font-medium text-foreground">
						{item.label}
					</h2>
				</Link>
			))}
			<div className="flex items-center gap-2">
				<SearchButtonDesktop />
				<Button
					variant="secondary"
					size="icon"
					className="bg-[#F5EDE8] hover:bg-[#f1e2da]"
				>
					<User size={20} />
				</Button>

				<Button
					size="icon"
					variant="secondary"
					className="bg-[#F5EDE8] hover:bg-[#f1e2da]"
				>
					<ShoppingCart size={20} />
				</Button>
			</div>
		</div>
	);
};

const MobileNav = () => {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button
					size="icon"
					variant="secondary"
					className="bg-[#F5EDE8] hover:bg-[#f1e2da]"
				>
					<Menu />
				</Button>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>{WEBSITE_TITLE}</SheetTitle>
				</SheetHeader>

				<div className="flex flex-col gap-2 mt-8">
					{NAV_ITEMS.map((item) => (
						<Link
							href={item.href}
							key={`mi-${item.href}`}
							className={cn(buttonVariants({ variant: "link" }), "px-0")}
						>
							<h2 className="text-lg font-medium text-foreground">
								{item.label}
							</h2>
						</Link>
					))}
					<div className="flex flex-col gap-2 mt-6">
						<SearchButtonMobile />

						<Button
							variant="secondary"
							size="icon"
							className="bg-[#F5EDE8] hover:bg-[#f1e2da] w-full"
						>
							<User size={20} />
						</Button>
						<Button
							size="icon"
							variant="secondary"
							className="bg-[#F5EDE8] hover:bg-[#f1e2da] w-full"
						>
							<ShoppingCart size={20} />
						</Button>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
};

const SearchButtonDesktop = () => {
	return (
		<Suspense
			fallback={
				<Button
					variant="secondary"
					size="icon"
					className="bg-[#F5EDE8] hover:bg-[#f1e2da]"
				>
					<Search size={18} />
				</Button>
			}
		>
			<SearchFormDialog>
				<Button
					variant="secondary"
					size="icon"
					className="bg-[#F5EDE8] hover:bg-[#f1e2da]"
				>
					<Search size={18} />
				</Button>
			</SearchFormDialog>
		</Suspense>
	);
};

const SearchButtonMobile = () => {
	return (
		<Suspense
			fallback={
				<Button
					variant="secondary"
					size="icon"
					className="bg-[#F5EDE8] hover:bg-[#f1e2da] w-full"
				>
					<Search size={18} />
				</Button>
			}
		>
			<SearchFormDialog>
				<Button
					variant="secondary"
					size="icon"
					className="bg-[#F5EDE8] hover:bg-[#f1e2da] w-full"
				>
					<Search size={18} />
				</Button>
			</SearchFormDialog>
		</Suspense>
	);
};

export default Header;
