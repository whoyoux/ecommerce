import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import Stripe from "stripe";

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET as string;

export async function POST(request: NextRequest) {
	const body = await request.text();
	const sig = headers().get("stripe-signature") as string;

	let event: Stripe.Event;
	try {
		event = await stripe.webhooks.constructEventAsync(
			body,
			sig,
			WEBHOOK_SECRET,
		);
	} catch (err) {
		return new Response(`Webhook error: ${err}`, {
			status: 400,
		});
	}

	switch (event.type) {
		case "checkout.session.completed": {
			const session = event.data.object as Stripe.Checkout.Session;
			if (!session)
				return new Response("There is something wrong with session object. ", {
					status: 400,
				});

			const orderId = session.metadata?.orderId;
			if (!orderId)
				return new Response("There is something wrong with orderId. ", {
					status: 400,
				});

			try {
				await prisma.order.update({
					where: {
						id: orderId,
					},
					data: {
						paid: true,
						paidAt: new Date(),
					},
				});
			} catch (err) {
				console.log(`[CRITICAL ERROR] Error updating order ${err}`);
				return new Response(`Database error: ${err}`, {
					status: 500,
				});
			}
			break;
		}
		default:
			console.log(`Unhandled event type ${event.type}`);
	}

	return new Response("ok", { status: 200 });
}
