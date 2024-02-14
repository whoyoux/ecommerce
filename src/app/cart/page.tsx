import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

import RemoveProductButton from "@/components/cart-page/remove-product-button";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

const CartPage = async () => {
	const session = await auth();
	if (!session || !session.user.id) redirect("/login");

	const cart = await prisma.cart.findUnique({
		where: {
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

	const isCartEmpty = !cart || cart.products.length === 0;

	return (
		<div className="max-w-screen-xl mx-auto w-full pt-10">
			<section className="flex flex-col gap-8">
				<h1 className="text-3xl font-bold">My cart</h1>
				{isCartEmpty ? (
					<h2>Your cart is empty.</h2>
				) : (
					<Table>
						<TableCaption>A list of your recent invoices.</TableCaption>
						<TableHeader>
							<TableRow>
								<TableHead className="w-[100px]">Image</TableHead>
								<TableHead>Name</TableHead>
								<TableHead className="text-right">Quantity</TableHead>
								<TableHead className="text-right">Price</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{cart.products.map((product) => (
								<TableRow key={product.id}>
									<TableCell>
										<Image
											src={product.product.images[0]}
											alt="Product image"
											width={100}
											height={100}
											className="rounded-lg"
										/>
									</TableCell>
									<TableCell className="font-medium">
										<Link href={`/product/${product.id}`}>
											{product.product.label}
										</Link>
									</TableCell>
									<TableCell className="text-right">
										{product.quantity}
									</TableCell>
									<TableCell className="text-right font-medium">
										${(product.product.price * product.quantity).toFixed(2)}
									</TableCell>
									<TableCell className="text-right">
										<RemoveProductButton productId={product.id} />
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
			</section>
		</div>
	);
};

export default CartPage;
