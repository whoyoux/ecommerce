"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { addProductToCartSchema } from "@/validators/cartSchema";
import { revalidatePath } from "next/cache";

type Response =
	| {
			success: false;
			code:
				| "SERVER_ERROR"
				| "NOT_AUTHENTICATED"
				| "INVALID_DATA"
				| "NOT_IMPLEMENTED";
			message: string;
	  }
	| {
			success: true;
			code:
				| "PRODUCT_ADDED_TO_CART"
				| "PRODUCT_REMOVED_FROM_CART"
				| "CART_CLEARED"
				| "PRODUCT_QUANTITY_UPDATED";
			message: string;
	  };

export const addToCart = async (formData: FormData): Promise<Response> => {
	console.log("Adding to cart");
	const parsedFormData = addProductToCartSchema.safeParse(
		Object.fromEntries(formData.entries()),
	);

	if (!parsedFormData.success) {
		return {
			success: false,
			code: "INVALID_DATA",
			message: "Invalid data",
		};
	}

	const { productId, quantity } = parsedFormData.data;

	const session = await auth();

	if (!session || !session.user?.id) {
		return {
			success: false,
			code: "NOT_AUTHENTICATED",
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
			success: false,
			code: "INVALID_DATA",
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

			return {
				success: true,
				code: "PRODUCT_QUANTITY_UPDATED",
				message: "Product added to cart",
			};
		}

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

		revalidatePath(`/product/${productId}`);
		return {
			success: true,
			code: "PRODUCT_ADDED_TO_CART",
			message: "Product added to cart",
		};
	} catch (err) {
		return {
			success: false,
			code: "SERVER_ERROR",
			message: "Server error. Please try again later.",
		};
	}
};

export const removeFromCart = async (productId: string): Promise<Response> => {
	const session = await auth();
	if (!session || !session.user?.id) {
		return {
			success: false,
			code: "NOT_AUTHENTICATED",
			message: "Not authenticated",
		};
	}

	try {
		await prisma.cart.update({
			where: {
				userId: session.user.id,
			},
			data: {
				products: {
					delete: {
						id: productId,
					},
				},
			},
		});

		revalidatePath("/cart");

		return {
			success: true,
			code: "PRODUCT_REMOVED_FROM_CART",
			message: "Product removed from cart",
		};
	} catch (err) {
		console.error(`Error removing product from cart: ${err}`);
		return {
			success: false,
			code: "SERVER_ERROR",
			message: "Server error. Please try again later.",
		};
	}
};
