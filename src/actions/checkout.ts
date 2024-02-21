"use server";

import { SHIPPING_OPTIONS } from "@/config/site-config";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";

type Response =
	| {
			success: true;
			url: string;
	  }
	| {
			success: false;
			code: "EMPTY_CART" | "NO_PERSONAL_INFORMATION" | "UNKNOWN_ERROR";
			message: string;
	  };

export const goToCheckout = async ({
	shippingId,
}: { shippingId: string }): Promise<Response> => {
	const session = await auth();

	if (!session || !session.user.id) {
		return redirect("/login");
	}

	const userWithCart = await prisma.user.findUnique({
		where: {
			id: session.user.id,
		},
		include: {
			cart: {
				include: {
					products: {
						include: {
							product: true,
						},
					},
				},
			},
			personalInformation: true,
		},
	});

	if (
		!userWithCart ||
		!userWithCart.cart?.products ||
		userWithCart.cart.products.length === 0
	) {
		return {
			success: false,
			code: "EMPTY_CART",
			message: "Your cart is empty. Please add some products first.",
		};
	}

	if (!userWithCart.personalInformation) {
		return {
			success: false,
			code: "NO_PERSONAL_INFORMATION",
			message: "Please fill personal information first.",
		};
	}

	const shippingOption = SHIPPING_OPTIONS.find(
		(option) => option.id === shippingId,
	);

	const shippingMethod = shippingOption?.id === "fast" ? "FAST" : "STANDARD";

	const totalPrice = userWithCart.cart.products.reduce((acc, product) => {
		return acc + product.product.price * product.quantity;
	}, 0);

	try {
		//Creating order in db
		const newOrder = await prisma.order.create({
			data: {
				userId: session.user.id,
				totalPrice,
				shippingPrice: shippingOption?.price ?? SHIPPING_OPTIONS[0].price,
				products: {
					createMany: {
						data: userWithCart.cart.products.map((product) => ({
							productId: product.productId,
							quantity: product.quantity,
						})),
					},
				},
				shippingMethod,
				shippingAddress: {
					create: {
						firstName: userWithCart.personalInformation.firstName,
						lastName: userWithCart.personalInformation.lastName,
						addressLine1: userWithCart.personalInformation.addressLine1,
						addressLine2: userWithCart.personalInformation.addressLine2,
						postalCode: userWithCart.personalInformation.postalCode,
						city: userWithCart.personalInformation.city,
						state: userWithCart.personalInformation.state,
						country: userWithCart.personalInformation.country,
						phoneNumber: userWithCart.personalInformation.phoneNumber,
					},
				},
			},
		});

		const stripeSession = await stripe.checkout.sessions.create({
			success_url: `${process.env.BASE_URL}/account/my-orders`,
			cancel_url: `${process.env.BASE_URL}/cart`,
			line_items: userWithCart.cart.products.map((product) => ({
				price_data: {
					unit_amount: product.product.price * 100,
					currency: "pln",
					product_data: {
						name: product.product.label,
						description: product.product.description,
						images: product.product.images,
					},
				},
				quantity: product.quantity,
			})),
			mode: "payment",
			shipping_options: [
				{
					shipping_rate:
						shippingOption?.stripePriceId ?? SHIPPING_OPTIONS[0].stripePriceId,
				},
			],
			payment_method_types: ["card", "blik", "p24"],
			customer: userWithCart.stripeCustomerId ?? undefined,
			allow_promotion_codes: true,
			metadata: {
				orderId: newOrder.id,
			},
		});

		if (!stripeSession.url) {
			return {
				success: false,
				code: "UNKNOWN_ERROR",
				message: "Something went wrong. Please try again later.",
			};
		}

		//Clearing cart
		await prisma.cart.update({
			where: {
				userId: session.user.id,
			},
			data: {
				products: {
					deleteMany: {},
				},
			},
		});

		return {
			success: true,
			url: stripeSession.url,
		};
	} catch (err) {
		console.error(err);
		return {
			success: false,
			code: "UNKNOWN_ERROR",
			message: String(err) ?? "Something went wrong. Please try again later.",
		};
	}
};
