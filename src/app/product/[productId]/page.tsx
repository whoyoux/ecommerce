import ProductImages from "@/components/product-page/product-images";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

import AddToCartForm from "@/components/product-page/add-to-cart-form";
import RecommendedProducts from "@/components/product-page/recommended-products";
import getBase64 from "@/lib/get-local-base64";
import { PrismaClientUnknownRequestError } from "@prisma/client/runtime/library";

export const dynamicParams = false;

export async function generateStaticParams() {
	const products = await prisma.product.findMany({});

	const paths = products.map((product) => ({
		productId: product.id,
	}));

	return paths;
}

const ProductPage = async ({ params }: { params: { productId: string } }) => {
	let product = null;
	try {
		product = await prisma.product.findFirst({
			where: {
				id: params.productId,
			},
			include: {
				category: true,
			},
		});
	} catch (err) {
		if (err instanceof PrismaClientUnknownRequestError) {
			console.log(err);
		}
	}

	if (!product) return null;

	const mainPhotoBase64 = await getBase64(product.images[0]);

	return (
		<div className="mx-auto w-full max-w-screen-lg">
			<div className="w-full flex flex-col md:flex-row justify-center mt-10 gap-4">
				<section className="flex-1">
					<ProductImages
						images={product.images}
						mainImageBase64={mainPhotoBase64 ?? ""}
					/>
				</section>
				<AddToCartForm product={product} />
			</div>
			<section className="mt-14">
				<RecommendedProducts
					category={product.category.name}
					currentProductId={product.id}
				/>
			</section>
		</div>
	);
};

export default ProductPage;
