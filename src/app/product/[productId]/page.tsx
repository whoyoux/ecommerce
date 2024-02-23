import ProductImages from "@/components/product-page/product-images";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

import AddToCartForm from "@/components/product-page/add-to-cart-form";
import RecommendedProducts from "@/components/product-page/recommended-products";
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
		include: {
			category: true,
		},
	});

	if (!product) return notFound();

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
