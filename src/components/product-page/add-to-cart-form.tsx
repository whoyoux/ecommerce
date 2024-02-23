"use client";

import { addToCart } from "@/actions/cart";
import { Button } from "@/components/ui/button";

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Product } from "@prisma/client";
import { Star } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

type AddToCartFormProps = {
	product: Product;
};

const AddToCartForm = ({ product }: AddToCartFormProps) => {
	const [quantity, setQuantity] = useState("1");
	const [isPending, startTransition] = useTransition();

	const addProductToCart = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append("productId", product.id);
		formData.append("quantity", quantity);
		const result = await addToCart(formData);

		if (result?.success) {
			toast.success(result.message);
		} else {
			toast.error(result.message);
		}
	};
	return (
		<form
			className="flex-1 flex flex-col gap-4 max-w-md mx-auto"
			onSubmit={(e) => startTransition(() => addProductToCart(e))}
		>
			<input type="hidden" name="productId" value={product.id} />
			<h1 className="text-3xl font-bold">{product.label}</h1>
			<div>
				<h3 className="text-2xl font-semibold mt-2">Descriptipn</h3>
				<p className="">{product.description}</p>
			</div>

			<div className="flex items-center gap-2">
				<span className="text-primary">
					<Star />
				</span>
				{`${product.rating.toFixed(2)} out of 5`}
			</div>

			<div className="flex items-center justify-between">
				<h3 className="text-2xl font-semibold">Stock</h3>
				<p className="font-medium">{product.inStock} left</p>
			</div>

			<div className="flex items-center justify-between">
				<h3 className="text-2xl font-semibold">Quantity</h3>
				<Select
					defaultValue="1"
					name="quantity"
					onValueChange={(v) => setQuantity(v)}
					disabled={isPending || product.inStock === 0}
				>
					<SelectTrigger className="w-[100px]">
						<SelectValue placeholder="Select quantity" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectLabel>Select quantity</SelectLabel>
							<SelectItem value="1">1</SelectItem>
							<SelectItem value="2">2</SelectItem>
							<SelectItem value="3">3</SelectItem>
							<SelectItem value="4">4</SelectItem>
							<SelectItem value="5">5</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
			</div>

			<div className="flex items-center gap-4 justify-between">
				<h2 className="text-3xl text-primary font-semibold">
					${product.price}
				</h2>
				<Button
					className="flex-1"
					type="submit"
					disabled={isPending || product.inStock === 0}
					aria-disabled={isPending || product.inStock === 0}
				>
					Add to cart
				</Button>
			</div>
		</form>
	);
};

export default AddToCartForm;
