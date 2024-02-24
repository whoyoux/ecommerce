import { prisma } from "@/lib/prisma";
import {
	CreditCard,
	DollarSign,
	LineChart,
	ShoppingBag,
	ShoppingCart,
	Users,
} from "lucide-react";
import { unstable_noStore } from "next/cache";

const getTotalSales = async (): Promise<number> => {
	const totalOrdersCount = await prisma.order.count({
		where: {
			canceled: false,
		},
	});
	return totalOrdersCount;
};

const getRevenue = async (): Promise<number> => {
	const totalRevenue = await prisma.order.aggregate({
		_sum: {
			totalPrice: true,
		},
	});
	return totalRevenue._sum.totalPrice ?? 0;
};

// Only get users registered by email and activated account or users registered by 3rd party providers
const getTotalRegisteredUsers = async (): Promise<number> => {
	const totalRegisteredUsers = await prisma.user.count({
		where: {
			OR: [
				{
					name: {
						not: null,
					},
					active: false,
				},
				{
					name: null,
					active: true,
				},
			],
		},
	});
	return totalRegisteredUsers;
};

const getTopSellingProducts = async () => {
	const topSellingProducts = await prisma.product.groupBy({
		by: ["id", "label"],
		where: {
			productInCart: {
				every: {
					order: {
						canceled: false,
					},
				},
			},
		},
	});

	console.log("top selling products: ", topSellingProducts);
	return topSellingProducts;
};

const AdminPage = async () => {
	unstable_noStore();
	const [totalSales, totalRevenue, totalUsers] = await Promise.all([
		getTotalSales(),
		getRevenue(),
		getTotalRegisteredUsers(),
	]);
	console.log("total sales: ", totalSales);
	console.log("total revenue: ", totalRevenue);
	return (
		<div className="w-full flex flex-col gap-4">
			<div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
				<Card
					label="Total sales"
					value={`${totalSales}`}
					icon={<ShoppingBag size={28} />}
				/>
				<Card label="Orders" value="345" icon={<ShoppingCart size={28} />} />
				<Card
					label="Revenue"
					value={`$${totalRevenue}`}
					icon={<CreditCard size={28} />}
				/>
				<Card
					label="Net profit"
					value="$1,210.00"
					icon={<DollarSign size={28} />}
				/>
				<Card
					label="Registered users"
					value={totalUsers.toString()}
					icon={<Users size={28} />}
				/>
			</div>
			<div className="w-full grid grid-cols-2 gap-4">
				<TopSellingProducts />
				<TopSellingProducts />
			</div>
		</div>
	);
};

const Card = ({
	label,
	value,
	icon,
}: { label: string; value: string; icon: React.ReactNode }) => {
	return (
		<div className="rounded-lg shadow-sm border w-full p-5">
			<h1 className="text-xl font-bold">{value}</h1>
			<h2 className="font-semibold text-muted-foreground">{label}</h2>
			<div className="flex items-center justify-end">{icon}</div>
		</div>
	);
};

const TopSellingProducts = () => {
	return (
		<section className="w-full rounded-lg shadow-sm border p-5">
			<h2 className="font-bold text-xl">Top selling products</h2>
			<span className="text-sm text-muted-foreground font-semibold">
				This month
			</span>
			<div>table here</div>
		</section>
	);
};

export default AdminPage;
