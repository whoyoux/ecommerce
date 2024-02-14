"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { addProductToCartSchema } from "@/validators/cartSchema";
import { revalidatePath, revalidateTag } from "next/cache";

type Response =
	| {
			error: true;
			errorCode:
				| "SERVER_ERROR"
				| "NOT_AUTHENTICATED"
				| "INVALID_DATA"
				| "NOT_IMPLEMENTED";
			message: string;
	  }
	| {
			success: true;
			message: string;
	  };

export const addToCart = async (formData: FormData): Promise<Response> => {
	console.log("Adding to cart");
	const parsedFormData = addProductToCartSchema.safeParse(
		Object.fromEntries(formData.entries()),
	);

	if (!parsedFormData.success) {
		return {
			error: true,
			errorCode: "INVALID_DATA",
			message: "Invalid data",
		};
	}

	const { productId, quantity } = parsedFormData.data;

	const session = await auth();

	if (!session || !session.user?.id) {
		return {
			error: true,
			errorCode: "NOT_AUTHENTICATED",
			message: "Not authenticated",
		};
	}

	const product = await prisma.product.findUnique({
		where: {
			id: productId,
		},
	});

	if (!product) {
		return {
			error: true,
			errorCode: "INVALID_DATA",
			message: "Invalid product id",
		};
	}

	const cart = await prisma.cart.findFirst({
		where: {
			userId: session.user.id,
		},
		include: {
			products: true,
		},
	});

	try {
		if (cart?.products?.find((p) => p.productId === productId)) {
			// Update the quantity
			await prisma.cart.update({
				where: {
					userId: session.user.id,
				},
				data: {
					products: {
						update: {
							where: {
								productId,
							},
							data: {
								quantity: {
									increment: quantity,
								},
							},
						},
					},
				},
			});
		} else {
			await prisma.cart.upsert({
				where: {
					userId: session.user.id,
				},
				update: {
					products: {
						create: {
							productId,
							quantity,
						},
					},
				},
				create: {
					userId: session.user.id,
					products: {
						create: {
							productId,
							quantity,
						},
					},
				},
			});
		}

		//Need to revalidate the page where user is right now
		revalidatePath(`/product/${productId}`);

		return {
			success: true,
			message: "Product added to cart",
		};
	} catch (err) {
		return {
			error: true,
			errorCode: "SERVER_ERROR",
			message: "Server error. Please try again later.",
		};
	}
};

export const removeFromCart = async (productId: string): Promise<Response> => {
	return {
		error: true,
		errorCode: "NOT_IMPLEMENTED",
		message: "Not implemented yet.",
	};
};
