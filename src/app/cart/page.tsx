import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

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
import { ProductInCart } from "@prisma/client";
import Image from "next/image";

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
			<section>
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
								<TableHead>Quantity</TableHead>
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
										{product.product.label}
									</TableCell>
									<TableCell>{product.quantity}</TableCell>
									<TableCell className="text-right font-medium">
										${(product.product.price * product.quantity).toFixed(2)}
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

// type CartTableProps = {
// 	products: ProductInCart[];
// };
// const CartTable = ({ products }: CartTableProps) => {
// 	return (
// 		<Table>
// 			<TableCaption>A list of your recent invoices.</TableCaption>
// 			<TableHeader>
// 				<TableRow>
// 					<TableHead className="w-[100px]">Image</TableHead>
// 					<TableHead>Name</TableHead>
// 					<TableHead>Quantity</TableHead>
// 					<TableHead className="text-right">Actions</TableHead>
// 				</TableRow>
// 			</TableHeader>
//             <TableBody>
//                 {products.map((product) => (
//                     <TableRow key={product.id}>
//                     <TableCell>image</TableCell>
//                     <TableCell className="font-medium">{product.}</TableCell>
//                     <TableCell>Credit Card</TableCell>
//                     <TableCell className="text-right">$250.00</TableCell>
//                   </TableRow>
//                 ))}
//             </TableBody>
// 		</Table>
// 	);
// };

export default CartPage;
