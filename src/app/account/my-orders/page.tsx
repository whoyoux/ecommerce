import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Order } from "@prisma/client";
import Link from "next/link";

const MyOrdersSubPage = async () => {
	const session = await auth();
	if (!session || !session.user.id) return null;

	const orders = await prisma.order.findMany({
		where: {
			userId: session.user.id,
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	const isOrdersEmpty = !orders || orders.length === 0;

	return (
		<div>
			<h1 className="text-2xl font-bold">My orders</h1>
			{isOrdersEmpty ? (
				<h2>You dont have any order.</h2>
			) : (
				<div className="flex flex-col gap-4 mt-6">
					{orders.map((order, idx) => (
						<OrderCard
							key={order.id}
							order={order}
							idx={orders.length - (idx + 1)}
						/>
					))}
				</div>
			)}
		</div>
	);
};

const OrderCard = ({ order, idx }: { order: Order; idx: number }) => {
	return (
		<div className="w-full border rounded-lg p-4">
			<div className="w-full flex items-center justify-between">
				<Link href={`/account/my-orders/${order.id}`}>
					<h3 className="font-semibold hover:underline underline-offset-4">
						Order {idx + 1}
					</h3>
				</Link>

				<span className="text-muted-foreground">
					{`${new Date(order.createdAt).toLocaleDateString("pl-PL")} ${new Date(
						order.createdAt,
					).toLocaleTimeString("pl-PL")}`}
				</span>
			</div>
			<h4 className="text-sm text-muted-foreground">
				Paid: {order.paid ? "Yes" : "No"}
			</h4>
		</div>
	);
};

export default MyOrdersSubPage;
