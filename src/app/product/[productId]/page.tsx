import ProductImages from "@/components/product-page/product-images";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

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

	return (
		<div className="mx-auto w-full max-w-screen-xl flex flex-col md:flex-row justify-center mt-10">
			<section className="w-1/2">
				<ProductImages images={product.images} />
			</section>
			<section className="w-1/2 flex flex-col gap-2">
				<h1 className="text-3xl font-bold">{product.label}</h1>
				<p className="">{product.description}</p>
				<div className="flex items-center gap-4">
					<h2 className="text-2xl text-primary font-semibold">
						${product.price}
					</h2>
					<Button>Add to cart</Button>
				</div>
			</section>
		</div>
	);
};

export default ProductPage;
