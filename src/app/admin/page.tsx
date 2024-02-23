import {
	CreditCard,
	DollarSign,
	LineChart,
	ShoppingBag,
	ShoppingCart,
} from "lucide-react";

const AdminPage = () => {
	return (
		<div className="w-full flex flex-col gap-4">
			<div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
				<Card
					label="Total sales"
					value="$5,100.00"
					icon={<ShoppingBag size={28} />}
				/>
				<Card label="Orders" value="345" icon={<ShoppingCart size={28} />} />
				<Card
					label="Revenue"
					value="$2,100.00"
					icon={<CreditCard size={28} />}
				/>
				<Card
					label="Net profit"
					value="$1,210.00"
					icon={<DollarSign size={28} />}
				/>
				<Card label="New visits" value="245" icon={<LineChart size={28} />} />
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
