import ProductCard from "@/components/product/product-card";
import { Product } from "@prisma/client";

type FeaturedProps = {
	products: Product[];
};

const Featured = ({ products }: FeaturedProps) => {
	const onlyFourProducts = products.slice(0, 4);

	return (
		<section>
			<h3 className="font-bold text-2xl">Featured Products</h3>
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
				{onlyFourProducts.map((product) => (
					<ProductCard key={`featured-${product.id}`} {...product} />
				))}
			</div>
		</section>
	);
};

export default Featured;
