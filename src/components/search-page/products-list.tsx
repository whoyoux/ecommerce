import { cn } from "@/lib/utils";
import { Product } from "@prisma/client";
import React from "react";
import ProductCard from "../product/product-card";

type ProductCardProps = {
	products: Product[];
	className?: string;
};

const ProductsList = ({ products, className }: ProductCardProps) => {
	return (
		<div
			className={cn(
				"grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4",
				className,
			)}
		>
			{products.length === 0 && (
				<h2 className="text-2xl font-bold">No products found.</h2>
			)}
			{products.map((product) => (
				<ProductCard key={product.id} {...product} className="" withRating />
			))}
		</div>
	);
};

export default ProductsList;
