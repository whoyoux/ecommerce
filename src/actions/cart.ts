"use server";

import { MAX_QUANTITY_PER_PRODUCTS } from "@/config/site-config";
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
				| "NOT_IMPLEMENTED"
				| "NO_STOCK_AVAILABLE";
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

	if (product.inStock === 0) {
		return {
			success: false,
			code: "NO_STOCK_AVAILABLE",
			message: "No stock available",
		};
	}

	if (product.inStock < quantity) {
		return {
			success: false,
			code: "NO_STOCK_AVAILABLE",
			message: "No stock available",
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
		const foundProductInCart = cart?.products?.find(
			(p) => p.productId === productId,
		);

		if (foundProductInCart) {
			// Update the quantity
			if (foundProductInCart.quantity + quantity > MAX_QUANTITY_PER_PRODUCTS) {
				return {
					success: false,
					code: "INVALID_DATA",
					message: `You can't add more than ${MAX_QUANTITY_PER_PRODUCTS} of the same product to the cart.`,
				};
			}

			if (foundProductInCart.quantity + quantity > product.inStock) {
				return {
					success: false,
					code: "NO_STOCK_AVAILABLE",
					message: `Not enough stock for ${product.label}.`,
				};
			}

			await prisma.cart.update({
				where: {
					userId: session.user.id,
				},
				data: {
					products: {
						update: {
							where: {
								id: foundProductInCart.id,
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

//TODO: Function must block the user from adding more than MAX_QUANTITY_PER_PRODUCTS products to the cart

export const incrementQtyInCart = async (
	productId: string,
): Promise<Response> => {
	const session = await auth();
	if (!session || !session.user?.id) {
		return {
			success: false,
			code: "NOT_AUTHENTICATED",
			message: "Not authenticated",
		};
	}

	// try {
	// 	await prisma.cart.update({
	// 		where: {
	// 			userId: session.user.id,
	// 		},
	// 		data: {
	// 			products: {
	// 				update: {
	// 					where: {
	// 						id: productId,
	// 					},
	// 					data: {
	// 						quantity: {
	// 							increment: 1,
	// 						},
	// 					},
	// 				},
	// 			},
	// 		},
	// 	});

	// 	revalidatePath("/cart");

	// 	return {
	// 		success: true,
	// 		code: "PRODUCT_QUANTITY_UPDATED",
	// 		message: "Product quantity updated",
	// 	};
	// } catch (err) {
	// 	console.error(`Error incrementing product quantity in cart: ${err}`);
	// 	return {
	// 		success: false,
	// 		code: "SERVER_ERROR",
	// 		message: "Server error. Please try again later.",
	// 	};
	// }

	//TODO: i need to think about how to show error message
	try {
		await prisma.$transaction(async (tx) => {
			const cart = await tx.cart.findFirst({
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

			if (!cart || !cart.products) {
				throw new Error("Cart not found or empty");
			}

			const product = cart.products.find((p) => p.id === productId);

			if (!product) {
				throw new Error("Product not found in cart");
			}

			if (
				product.product.inStock === 0 ||
				product.product.inStock - product.quantity - 1 <= 0
			) {
				throw new Error("No stock available");
			}

			if (product.quantity + 1 <= MAX_QUANTITY_PER_PRODUCTS) {
				await tx.cart.update({
					where: {
						userId: session.user.id,
					},
					data: {
						products: {
							update: {
								where: {
									id: productId,
								},
								data: {
									quantity: {
										increment: 1,
									},
								},
							},
						},
					},
				});
			} else {
				throw new Error(
					`You can't add more than ${MAX_QUANTITY_PER_PRODUCTS} of the same product to the cart.`,
				);
			}
		});

		revalidatePath("/cart");

		return {
			success: true,
			code: "PRODUCT_QUANTITY_UPDATED",
			message: "Product quantity updated",
		};
	} catch (err) {
		console.error(`Error incrementing product quantity in cart: ${err}`);
		return {
			success: false,
			code: "SERVER_ERROR",
			message: "Server error. Please try again later.",
		};
	}
};

export const decrementQtyInCart = async (productId: string) => {
	const session = await auth();
	if (!session || !session.user?.id) {
		return {
			success: false,
			code: "NOT_AUTHENTICATED",
			message: "Not authenticated",
		};
	}

	try {
		await prisma.$transaction(async (tx) => {
			const cart = await tx.cart.findFirst({
				where: {
					userId: session.user.id,
				},
				include: {
					products: true,
				},
			});

			if (!cart || !cart.products) {
				throw new Error("Cart not found or empty");
			}

			const product = cart.products.find((p) => p.id === productId);

			if (!product) {
				throw new Error("Product not found in cart");
			}

			if (product.quantity > 1) {
				await tx.cart.update({
					where: {
						userId: session.user.id,
					},
					data: {
						products: {
							update: {
								where: {
									id: productId,
								},
								data: {
									quantity: {
										decrement: 1,
									},
								},
							},
						},
					},
				});
			} else {
				await tx.cart.update({
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
			}
		});

		revalidatePath("/cart");

		return {
			success: true,
			code: "PRODUCT_QUANTITY_UPDATED",
			message: "Product quantity updated",
		};
	} catch (err) {
		console.error(`Error decrementing product quantity in cart: ${err}`);
		return {
			success: false,
			code: "SERVER_ERROR",
			message: "Server error. Please try again later.",
		};
	}
};
