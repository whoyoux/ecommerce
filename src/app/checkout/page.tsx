import AddressSection from "@/components/checkout-page/address-section";
import CheckoutForm from "@/components/checkout-page/checkout-form";
import CheckoutSection from "@/components/checkout-page/checkout-section";
import { Button, buttonVariants } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { redirect } from "next/navigation";

const CheckoutPage = async () => {
	const session = await auth();
	if (!session || !session.user.id) redirect("/login");

	const user = await prisma.user.findUnique({
		where: {
			id: session.user.id,
		},
		include: {
			personalInformation: true,
			cart: {
				include: {
					products: {
						include: {
							product: true,
						},
					},
				},
			},
		},
	});

	if (!user) redirect("/login");
	if (!user.cart || user.cart.products.length === 0) redirect("/cart");

	const totalCartValue = user.cart.products.reduce(
		(acc, cartProduct) =>
			acc + cartProduct.product.price * cartProduct.quantity,
		0,
	);

	return (
		<div className="max-w-screen-xl mx-auto w-full pt-14 flex flex-col gap-10">
			<h1 className="text-2xl font-bold">Checkout</h1>
			<CheckoutSection title="Shipping Address">
				<AddressSection personalInformations={user.personalInformation} />
			</CheckoutSection>

			<CheckoutForm totalCartValue={totalCartValue} cart={user.cart} />

			<section className="flex flex-col gap-1">
				<div className="text-right text-sm text-muted-foreground">
					<p>By proceeding to payment, I undertake to pay.</p>
				</div>
				<div className="flex items-center justify-end gap-4">
					<Button>Continue to payment</Button>
					<Link
						href="/cart"
						className={cn(buttonVariants({ variant: "secondary" }))}
					>
						Cancel
					</Link>
				</div>
			</section>
		</div>
	);
};

export default CheckoutPage;
