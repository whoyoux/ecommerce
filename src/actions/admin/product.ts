"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { editProductSchema } from "@/validators/admin/productSchema";
import { revalidatePath } from "next/cache";
import { fromZodError } from "zod-validation-error";

export const editProduct = async (formData: FormData) => {
	const parsedFormData = editProductSchema.safeParse(
		Object.fromEntries(formData.entries()),
	);

	if (!parsedFormData.success) {
		console.log(parsedFormData.error.message);
		return {
			success: false,
			code: "INVALID_DATA",
			message: `${fromZodError(parsedFormData.error).toString()}`,
		};
	}

	const session = await auth();

	if (!session || !session.user?.id || session.user.role !== "ADMIN") {
		return {
			success: false,
			code: "NOT_AUTHENTICATED",
			message: "Not authenticated",
		};
	}

	const { id, label, description, price } = parsedFormData.data;

	try {
		await prisma.product.update({
			where: {
				id,
			},
			data: {
				label,
				description,
				price,
			},
		});

		revalidatePath(`/admin/products/${id}`);
		revalidatePath(`/product/${id}`);
		return {
			success: true,
		};
	} catch (err) {
		console.error(err);
		return {
			success: false,
			code: "SERVER_ERROR",
			message: "Server error",
		};
	}
};
