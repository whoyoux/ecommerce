import Stripe from "stripe";
import { prisma } from "./prisma";

const key = process.env.STRIPE_SECRET_KEY;
if (!key) {
	throw new Error("Missing Stripe secret key");
}

export const stripe = new Stripe(key, {
	apiVersion: "2023-10-16",
	typescript: true,
});

export const addStripeCustomer = async ({
	id,
	email,
}: { id: string | undefined; email: string | null | undefined }) => {
	if (!email || !id) {
		throw new Error("Invalid user data");
	}

	try {
		const stripeCustomer = await stripe.customers.create({
			email,
		});

		//TODO: Add maybe more informations, but for now it's enough
		await prisma.user.update({
			where: {
				id,
			},
			data: {
				stripeCustomerId: stripeCustomer.id,
			},
		});

		console.log("Stripe customer created successfully.");
	} catch (err) {
		throw new Error(`Server error: ${err}`);
	}
};
