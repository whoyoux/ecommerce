import { z } from "zod";

export const addProductToCartSchema = z.object({
	productId: z.string(),
	// Quantity is a string because it comes from a form, but we need it as a number
	quantity: z.coerce.number().int().min(1).max(5),
});
