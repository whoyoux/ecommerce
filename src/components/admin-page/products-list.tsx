"use client";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Product } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type AdminProductsListProps = {
	products: Product[];
};

const AdminProductsList = ({
	products: productsFromDB,
}: AdminProductsListProps) => {
	const [products, setProducts] = useState<Product[]>([]);
	const [search, setSearch] = useState<string>("");

	useEffect(() => {
		setProducts(productsFromDB);
	}, [productsFromDB]);

	useEffect(() => {
		if (search.trim() === "") {
			setProducts(productsFromDB);
		} else {
			setProducts(
				productsFromDB.filter((product) =>
					product.label.toLowerCase().includes(search.trim().toLowerCase()),
				),
			);
		}
	}, [search, productsFromDB]);

	return (
		<>
			<div className="flex flex-col gap-4 pb-8">
				<h2 className="text-2xl font-semibold">Select product for edit</h2>
				<Input
					placeholder="Search products"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
			</div>
			<div className="flex flex-col gap-4">
				{products.length === 0 && (
					<h4 className="text-lg font-medium">No products found</h4>
				)}
				{products.map((product) => (
					<div key={product.id} className="flex gap-2">
						<Image
							src={product.images[0]}
							alt={product.label}
							width={80}
							height={80}
							className="rounded-lg"
						/>
						<div className="flex flex-col justify-between items-start">
							<h3 className="text-lg font-medium">{product.label}</h3>
							<Link
								href={`/admin/products/${product.id}`}
								className={cn(buttonVariants({ variant: "secondary" }))}
							>
								Edit
							</Link>
						</div>
					</div>
				))}
			</div>
		</>
	);
};

export default AdminProductsList;
