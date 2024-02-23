"use client";
import { cn } from "@/lib/utils";
import { Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavButtonProps = {
	href: string;
	label: string;
	icon: React.ReactNode;
};

const NavButton = ({ href, label, icon }: NavButtonProps) => {
	const pathname = usePathname();

	const isActive = pathname === href;

	return (
		<Link
			href={href}
			className={cn(
				"group text-muted-foreground flex gap-2 items-center hover:text-foreground cursor-pointer transition-all rounded-lg py-3 px-3 hover:bg-secondary",
				isActive && "bg-secondary text-foreground",
			)}
		>
			{icon}
			<span className="text-sm font-semibold">{label}</span>
		</Link>
	);
};
export default NavButton;
