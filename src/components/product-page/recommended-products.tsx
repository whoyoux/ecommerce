import { prisma } from "@/lib/prisma";
import ProductCard from "../product/product-card";

const RecommendedProducts = async ({
	category,
	currentProductId,
}: { category: string; currentProductId: string }) => {
	const products = await prisma.product.findMany({
		where: {
			category: {
				name: category,
			},
			NOT: {
				id: currentProductId,
			},
		},
		take: 5,
	});

	return (
		<div>
			<h2 className="text-2xl font-bold mb-4">Recommended Products</h2>
			<div className="grid grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
				{products.map((product) => (
					<ProductCard {...product} key={product.id} />
				))}
			</div>
		</div>
	);
};

export default RecommendedProducts;
