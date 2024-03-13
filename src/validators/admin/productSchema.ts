import { z } from "zod";

export const editProductSchema = z.object({
	id: z.string().min(1),
	label: z.string().min(1),
	description: z.string().min(1),
	price: z.coerce.number().min(0.01).max(1000000),
});
