import NavButton from "@/components/admin-page/nav-button";
import { auth } from "@/lib/auth";
import { Home, LineChart, Package, ShoppingCart, Users } from "lucide-react";
import { notFound } from "next/navigation";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
	const session = await auth();
	if (!session || session.user.role !== "ADMIN") return notFound();

	return (
		<div className="flex gap-2 px-20 mx-auto w-full h-[calc(100dvh-90px)]">
			<div className="border-r w-[200px] pr-2 flex flex-col gap-1 pt-10">
				<NavButton href="/admin" label="Home" icon={<Home size={18} />} />
				<NavButton
					href="/admin/products"
					label="Products"
					icon={<Package size={18} />}
				/>
				<NavButton
					href="/admin/orders"
					label="Orders"
					icon={<ShoppingCart size={18} />}
				/>
				<NavButton
					href="/admin/customers"
					label="Customers"
					icon={<Users size={18} />}
				/>
				<NavButton
					href="/admin/analytics"
					label="Analytics"
					icon={<LineChart size={18} />}
				/>
			</div>
			<div className="flex-1 pt-10">{children}</div>
		</div>
	);
};

export default AdminLayout;
