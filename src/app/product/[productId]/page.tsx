import ProductImages from "@/components/product-page/product-images";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Star } from "lucide-react";
import getBase64 from "@/lib/get-local-base64";

export async function generateStaticParams() {
	const products = await prisma.product.findMany({});

	return products.map((product) => ({
		productId: product.id,
	}));
}

const ProductPage = async ({ params }: { params: { productId: string } }) => {
	const product = await prisma.product.findFirst({
		where: {
			id: params.productId,
		},
	});

	if (!product) return notFound();

	const mainPhotoBase64 = await getBase64(product.images[0]);

	const addToCart = async (formData: FormData) => {
		"use server";
		console.log(formData.get("quantity"));
	};

	return (
		<div className="mx-auto w-full max-w-screen-lg">
			<div className="w-full flex flex-col md:flex-row justify-center mt-10 gap-4">
				<section className="flex-1">
					<ProductImages
						images={product.images}
						mainImageBase64={mainPhotoBase64 ?? ""}
					/>
				</section>
				<form
					className="flex-1 flex flex-col gap-4 max-w-md mx-auto"
					action={addToCart}
				>
					<h1 className="text-3xl font-bold">{product.label}</h1>
					<div>
						<h3 className="text-2xl font-semibold mt-2">Descriptipn</h3>
						<p className="">{product.description}</p>
					</div>

					<div className="flex items-center gap-2">
						<span className="text-primary">
							<Star />
						</span>
						{`${product.rating} out of 5`}
					</div>

					<div className="flex items-center justify-between">
						<h3 className="text-2xl font-semibold">Quantity</h3>
						<Select defaultValue="1" name="quantity">
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
						<Button className="flex-1" type="submit">
							Add to cart
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default ProductPage;
