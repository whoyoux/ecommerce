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
			message: string;
	  }
	| never;

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
		return redirect("/cart");
	}

	if (!userWithCart.personalInformation) {
		return redirect("/account/personal-informations");
	}

	const shippingOption =
		SHIPPING_OPTIONS.find((option) => option.id === shippingId)
			?.stripePriceId ?? SHIPPING_OPTIONS[0].stripePriceId;

	try {
		//Creating order in db
		const newOrder = await prisma.order.create({
			data: {
				userId: session.user.id,
				products: {
					createMany: {
						data: userWithCart.cart.products.map((product) => ({
							productId: product.productId,
							quantity: product.quantity,
						})),
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
					shipping_rate: shippingOption,
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
			message: String(err) ?? "Something went wrong. Please try again later.",
		};
	}
};
