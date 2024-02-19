"use client";

import CheckoutCard from "@/components/checkout-page/checkout-card";
import CheckoutSection from "@/components/checkout-page/checkout-section";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SHIPPING_OPTIONS } from "@/config/site-config";
import { Prisma } from "@prisma/client";
import { Truck } from "lucide-react";
import { useState } from "react";

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

	const selectedShipping = SHIPPING_OPTIONS.find(
		(opt) => opt.id === selectedShippingOption,
	);

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

			<CheckoutSection title="Summary">
				<div className="flex flex-col gap-2">
					{cart.products.map((cartProduct) => (
						<div
							key={cartProduct.id}
							className="flex items-center justify-between"
						>
							<h3 className="font-semibold">
								{cartProduct.product.label} x{cartProduct.quantity}
							</h3>
							<h3 className="font-semibold">
								${cartProduct.product.price * cartProduct.quantity}
							</h3>
						</div>
					))}
					<div className="flex items-center justify-between">
						<h3 className="font-semibold">Shipping</h3>
						<h3 className="font-semibold">${selectedShipping?.price ?? "?"}</h3>
					</div>
					<div className="flex items-center justify-between">
						<h3 className="font-semibold text-xl">Total</h3>
						<h3 className="font-semibold text-xl">
							${totalCartValue + (selectedShipping?.price ?? 0)}
						</h3>
					</div>
				</div>
			</CheckoutSection>
		</>
	);
};

export default CheckoutForm;
