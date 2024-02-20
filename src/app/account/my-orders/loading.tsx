import { Skeleton } from "@/components/ui/skeleton";

const LoadingMyOrders = () => {
	return (
		<div className="flex flex-col gap-6">
			<h1 className="text-2xl font-bold">My orders</h1>
			{Array.of(1, 2, 3, 4, 5).map((i) => (
				<Skeleton key={i} className="w-full h-12 rounded-lg" />
			))}
		</div>
	);
};

export default LoadingMyOrders;
