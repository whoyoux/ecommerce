import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

import DecrementQtyForm from "@/components/cart-page/decrement-qty-form";
import IncrementQtyForm from "@/components/cart-page/increment-qty-form";
import RemoveProductButton from "@/components/cart-page/remove-product-button";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { prisma } from "@/lib/prisma";
import { Cart, Prisma } from "@prisma/client";
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
				orderBy: {
					product: {
						label: "asc",
					},
				},
			},
		},
	});

	const isCartEmpty = !cart || cart.products.length === 0;

	const subPrice =
		cart?.products?.reduce(
			(acc, product) => product.product.price * product.quantity + acc,
			0,
		) || 0;

	const taxValue = subPrice * 0.23;

	const totalPrice = subPrice + taxValue;

	return (
		<div className="max-w-screen-xl mx-auto w-full pt-10">
			<section className="flex flex-col gap-8">
				<h1 className="text-3xl font-bold">My cart</h1>
				{isCartEmpty ? (
					<h2>Your cart is empty.</h2>
				) : (
					<>
						<div className="hidden md:flex w-full">
							<CartForDesktop {...cart} />
						</div>
						<div className="flex md:hidden">
							<CartForMobile {...cart} />
						</div>
					</>
				)}
				{!isCartEmpty && (
					<>
						<div className="flex flex-col items-end gap-2">
							<h3 className="text-xl font-semibold">
								Subtotal: ${subPrice?.toFixed(2)}
							</h3>
							<h3 className="text-xl font-semibold">
								Tax: ${taxValue?.toFixed(2)}
							</h3>
							<h3 className="text-xl font-semibold">
								Total: ${totalPrice?.toFixed(2)}
							</h3>
						</div>
						<div className="flex justify-end">
							<Button>Proceed to Checkout</Button>
						</div>
					</>
				)}
			</section>
		</div>
	);
};

type ProductsFromCart = Prisma.CartGetPayload<{
	include: {
		products: {
			include: {
				product: true;
			};
		};
	};
}>;

const CartForDesktop = ({ products }: ProductsFromCart) => {
	return (
		<Table>
			<TableCaption>A list of products in your cart.</TableCaption>
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
				{products.map((product) => (
					<TableRow key={`dc-${product.id}`}>
						<TableCell>
							<Image
								src={product.product.images[0]}
								alt="Product image"
								width={100}
								height={100}
								className="rounded-lg"
							/>
						</TableCell>
						<TableCell className="font-medium truncate max-w-[100px]">
							<Link
								href={`/product/${product.product.id}`}
								className="truncate"
							>
								{product.product.label}
							</Link>
						</TableCell>
						<TableCell className="text-right">
							<div className="gap-2 flex items-center justify-end">
								<DecrementQtyForm productId={product.id} />
								<span className="font-medium">{product.quantity}</span>
								<IncrementQtyForm productId={product.id} />
							</div>
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
	);
};

const CartForMobile = ({ products }: ProductsFromCart) => {
	return (
		<div className="w-full flex flex-col gap-4">
			{products.map((product) => (
				<div
					key={`cm-${product.id}`}
					className="w-full flex gap-4 border-b pb-5"
				>
					<div>
						<Image
							src={product.product.images[0]}
							alt="Product image"
							width={100}
							height={100}
							className="rounded-lg"
						/>
					</div>
					<div className="flex flex-col gap-4 flex-1">
						<Link
							href={`/product/${product.product.id}`}
							className="text-xl font-semibold"
						>
							{product.product.label}
						</Link>

						<div className="flex items-center gap-2 w-full justify-between">
							<div className="flex items-center gap-2">
								<DecrementQtyForm productId={product.id} />
								<span>{product.quantity}</span>
								<IncrementQtyForm productId={product.id} />
							</div>
							<RemoveProductButton productId={product.id} />
						</div>
						<div className="flex justify-end">
							<span className="font-semibold">
								${(product.product.price * product.quantity).toFixed(2)}
							</span>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

export default CartPage;
