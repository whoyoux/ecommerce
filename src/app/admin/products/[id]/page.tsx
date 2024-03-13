import ProductImages from "@/components/product-page/product-images";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import React from "react";

import EditProductModal from "@/components/admin-page/edit-product-modal";
import Link from "next/link";

const AdminProductPage = async ({ params }: { params: { id: string } }) => {
	const product = await prisma.product.findUnique({
		where: {
			id: params.id,
		},
	});

	if (!product) return notFound();

	return (
		<div className="w-full">
			<div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
				<div className="flex-1 min-w-[300px]">
					<ProductImages images={product.images} />
				</div>
				<div className="flex gap-4 flex-col">
					<div className="flex gap-4 items-center justify-between">
						<Link href={`/product/${product.id}`}>
							<h2 className="text-lg font-semibold hover:underline">
								{product.label}
							</h2>
						</Link>
						<EditProductModal product={product} />
					</div>
					<p className="text-muted-foreground">{product.description}</p>
					<p className="text-xl font-medium">${product.price}</p>
				</div>
			</div>
		</div>
	);
};

export default AdminProductPage;
