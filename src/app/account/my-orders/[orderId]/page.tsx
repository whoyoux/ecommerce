import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma, ProductInCart } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const SpecificOrderPage = async ({
	params,
}: { params: { orderId: string } }) => {
	const session = await auth();
	if (!session || !session.user.id) return null;

	const order = await prisma.order.findUnique({
		where: {
			id: params.orderId,
			userId: session.user.id,
		},
		include: {
			products: {
				include: {
					product: true,
				},
			},
		},
	});

	if (!order) return notFound();

	type ShippingStatus = typeof order.shippingStatus;

	const renderStatus = (status: ShippingStatus) => {
		switch (status) {
			case "PENDING":
				return <span className="text-lg">Processing</span>;
			case "SHIPPED":
				return <span className="text-lg">Shipped</span>;
			case "DELIVERED":
				return <span className="text-lg">Delivered</span>;
			default:
				return "Unknown";
		}
	};

	return (
		<div>
			<h1 className="text-3xl font-extrabold">Order</h1>
			<p className="font-medium">
				{`Created at: ${new Date(order.createdAt).toLocaleDateString(
					"pl-PL",
				)} ${new Date(order.createdAt).toLocaleTimeString("pl-PL")}`}
			</p>
			<div>
				<h2 className="text-xl font-semibold mt-4">
					Current status:{" "}
					<span className="text-lg">{renderStatus(order.shippingStatus)}</span>
				</h2>
			</div>
			<section>
				<ul className="flex flex-col gap-2 mt-4">
					<h2 className="text-xl font-semibold">Products</h2>
					{order.products.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</ul>
			</section>
			<section className="text-right space-y-2 pt-10">
				<h2 className="text-xl font-semibold">
					Subtotal price:{" "}
					<span className="text-normal">${order.totalPrice}</span>
				</h2>
				<h2 className="text-xl font-semibold mt-4">
					Shipping method:{" "}
					<span className="text-normal">{order.shippingMethod}</span>
				</h2>
				<h2 className="text-xl font-semibold mt-4">
					Shipping price:{" "}
					<span className="text-normal">${order.shippingPrice}</span>
				</h2>
				<h2 className="text-xl font-semibold">
					Total price:{" "}
					<span className="text-normal">
						${order.totalPrice + order.shippingPrice}
					</span>
				</h2>
			</section>
		</div>
	);
};

type ProductCardProps = {
	product: Prisma.ProductInCartGetPayload<{
		include: {
			product: true;
		};
	}>;
};

const ProductCard = ({ product }: ProductCardProps) => {
	return (
		<li className="flex gap-2 border rounded-lg p-4">
			<Image
				src={product.product.images[0]}
				alt={product.product.label}
				width={75}
				height={75}
				className="rounded-sm"
			/>
			<div className="flex flex-col font-semibold w-full">
				<div className="flex items-center justify-between w-full">
					<Link href={`/product/${product.product.id}`}>
						<h3 className="text-lg font-semibold hover:underline underline-offset-4">
							{product.product.label}
						</h3>
					</Link>
					<h3 className="font-semibold">
						${(product.product.price * product.quantity).toFixed(2)}
					</h3>
				</div>
				<h3>Quantity: {product.quantity}</h3>
			</div>
		</li>
	);
};

export default SpecificOrderPage;
