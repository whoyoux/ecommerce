"use client";

import { goToCheckout } from "@/actions/checkout";
import CheckoutCard from "@/components/checkout-page/checkout-card";
import CheckoutSection from "@/components/checkout-page/checkout-section";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SHIPPING_OPTIONS } from "@/config/site-config";
import { cn } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import { Truck } from "lucide-react";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button, buttonVariants } from "../ui/button";

type CheckoutFormProps = {
	totalCartValue: number;
	cart: Prisma.CartGetPayload<{
		include: {
			products: {
				include: {
					product: true;
				};
			};
		};
	}>;
};

const CheckoutForm = ({ totalCartValue, cart }: CheckoutFormProps) => {
	const [selectedShippingOption, setSelectedShippingOption] =
		useState("standard");

	const router = useRouter();

	const selectedShipping = SHIPPING_OPTIONS.find(
		(opt) => opt.id === selectedShippingOption,
	);

	const handleCheckout = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const result = await goToCheckout({ shippingId: selectedShippingOption });
		if (result.success) {
			router.push(result.url);
		} else {
			toast.error(result.message);
		}
	};

	return (
		<>
			<CheckoutSection title="Shipping Speed">
				<RadioGroup
					defaultValue="standard"
					className="divide-y"
					onValueChange={setSelectedShippingOption}
					value={selectedShippingOption}
				>
					{SHIPPING_OPTIONS.map((shippingOption) => (
						<div className="flex items-center gap-4" key={shippingOption.id}>
							<RadioGroupItem
								value={shippingOption.id}
								id={`shipping-${shippingOption.id}`}
							/>
							<Label
								htmlFor={`shipping-${shippingOption.id}`}
								className="flex items-center justify-between w-full py-2"
							>
								<CheckoutCard
									icon={<Truck />}
									firstLine={shippingOption.label}
									secondLine={shippingOption.description}
								/>
								<h2 className="text-lg font-bold">${shippingOption.price}</h2>
							</Label>
						</div>
					))}
				</RadioGroup>
			</CheckoutSection>

			<CheckoutSection title="Payment Method">
				<div>
					<h3 className="font-semibold text-muted-foreground">
						You will be able to change payment methods on payment page.
					</h3>
					<h3 className="font-semibold text-muted-foreground">
						We accept Credit Card and BLIK.
					</h3>
				</div>
			</CheckoutSection>

			<CheckoutSection title="Coupons">
				<h3 className="font-semibold text-muted-foreground">
					You will be able to add coupons on payment page.
				</h3>
				<div>
					<h3 className="font-semibold text-muted-foreground">
						Avaiable coupons:
					</h3>
					<ul>
						<li className="text-muted-foreground">
							FIRST25 - 25% off for first order
						</li>
						<li className="text-muted-foreground">
							PROMO50 - 50 PLN off for orders over 200 PLN, can be used multiple
							times
						</li>
					</ul>
				</div>
			</CheckoutSection>

			<CheckoutSection title="Summary">
				<div className="flex flex-col gap-2">
					{cart.products.map((cartProduct) => (
						<div
							key={cartProduct.id}
							className="flex items-center justify-between"
						>
							<h3 className="font-medium truncate">
								{cartProduct.product.label} x{cartProduct.quantity}
							</h3>
							<h3 className="font-semibold">
								${cartProduct.product.price * cartProduct.quantity}
							</h3>
						</div>
					))}
					<div className="flex items-center justify-between">
						<h3 className="font-semibold">Shipping</h3>
						<h3 className="font-semibold">
							{selectedShipping?.label} - ${selectedShipping?.price ?? "?"}
						</h3>
					</div>
					<div className="flex items-center justify-between mt-2">
						<h3 className="font-semibold text-xl">Total</h3>
						<h3 className="font-semibold text-xl">
							${totalCartValue + (selectedShipping?.price ?? 0)}
						</h3>
					</div>
				</div>
			</CheckoutSection>
			<form className="flex flex-col gap-1" onSubmit={handleCheckout}>
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
			</form>
		</>
	);
};

export default CheckoutForm;
